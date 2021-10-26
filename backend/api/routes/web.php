<?php

use Illuminate\Http\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

require '../vendor/autoload.php';

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->get('/api/login', function (Request $request) {
    $session = new SpotifyWebAPI\Session(
        env("SPOTIFY_CLIENT_ID"),
        env("SPOTIFY_CLIENT_SECRET"),
        env("SPOTIFY_REDIRECT_URI")
    );
    $api = new SpotifyWebAPI\SpotifyWebAPI();
    if ($request->input('code') != NULL) {
        $session->requestAccessToken($request->input('code'));
        $api->setAccessToken($session->getAccessToken());
    
        $user = json_decode(json_encode($api->me()), true);
        Log::info(var_dump($user));
        // check if user exists in database
        $result = DB::select("SELECT id FROM users WHERE id = ?", [$user['id']]);
        if (count($result) == 0) { // user does not exist in database, insert
            DB::insert("INSERT INTO `users` (`id`, `username`, `profileImageUrl`, `spotifyProfileUrl`, `email`, `followers`, `premium`, `accessToken`, `refreshToken`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [$user['id'], $user['display_name'], $user['images'][0]['url'], $user['external_urls']['spotify'], $user['email'], $user['followers']['total'], $user['product'] == 'premium' ? 1 : 0, $session->getAccessToken(), $session->getRefreshToken()]);
        }

        return redirect('/api/users/' . $user['id']);
    } else {
        $options = [
            'scope' => [
                'user-read-email',
                'user-read-private'
            ],
        ];
    
        header('Location: ' . $session->getAuthorizeUrl($options));
        die();
    }
});

$router->get('/api/users/{id}', function($id, Request $request) {
    $api = getSpotifyApi($id);
    return response()->json($api->me());
});

function getSpotifyApi($userId) {
    $session = new SpotifyWebAPI\Session(
        env("SPOTIFY_CLIENT_ID"),
        env("SPOTIFY_CLIENT_SECRET"),
    );

    // get existing access tokens
    $result = json_decode(json_encode(DB::select("SELECT accessToken, refreshToken FROM users WHERE id = ?", [$userId])), true);
    
    // get new access token
    $session->refreshAccessToken($result[0]['refreshToken']);

    $options = [
        'auto_refresh' => true,
    ];

    $api = new SpotifyWebAPI\SpotifyWebAPI($options, $session);

    // get new access token and add it
    $newAccessToken = $session->getAccessToken();
    $newRefreshToken = $session->getRefreshToken();

    DB::update("UPDATE `users` SET `accessToken` = ?, `refreshToken` = ? WHERE `users`.`id` = ?", [$newAccessToken, $newRefreshToken, $userId]);

    return $api;
}
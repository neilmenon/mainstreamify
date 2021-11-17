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

List of Routes:
/api - GET
/api/login - GET
/api/logout - GET
/api/users/{id} - GET
/api/test - GET
/api/top - POST

php -S localhost:8000 -t public
|
*/

$router->get('/', function () {
    return response()->json([
        "message" => "This is the API index for the app mainstreamify. Powered by Lumen by Laravel.",
        "signedIn" => isSignedIn()
    ]);
});

$router->get('/login', function (Request $request) {
    // user already has a session/registered with the app?
    if (isset($_SESSION['access_token'])) {
        $result = json_decode(json_encode(DB::select("SELECT id FROM users WHERE accessToken = ?", [$_SESSION['access_token']])), true);
        if (count($result) > 0) {
            return redirect(env("FRONTEND_URL"));
        }
    }

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
        
        // check if user exists in database
        $result = DB::select("SELECT id FROM users WHERE id = ?", [$user['id']]);
        
        if (count($result) == 0) { // user does not exist in database, insert
            DB::insert("INSERT INTO `users` (`id`, `username`, `profileImageUrl`, `spotifyProfileUrl`, `email`, `followers`, `premium`, `accessToken`, `refreshToken`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [$user['id'], $user['display_name'], $user['images'] ? $user['images'][0]['url'] : NULL, $user['external_urls']['spotify'], $user['email'], $user['followers']['total'], $user['product'] == 'premium' ? 1 : 0, $session->getAccessToken(), $session->getRefreshToken()]);
        } else { // user exists, update access and refresh tokens
            DB::update("UPDATE `users` SET `accessToken` = ?, `refreshToken` = ? WHERE `users`.`id` = ?", [$session->getAccessToken(), $session->getRefreshToken(), $user['id']]);
        }

        // store access token in the session
        $_SESSION['access_token'] = $session->getAccessToken();

        return redirect(env("FRONTEND_URL"));
    } else {
        $options = [
            'scope' => [
                'user-read-email',
                'user-read-private',
                'user-top-read',
                'user-read-recently-played',
            ],
        ];
    
        header('Location: ' . $session->getAuthorizeUrl($options));
        die();
    }
});

$router->get('/logout', function() {
    // simply destroy the access token and return to index
    unset($_SESSION['access_token']);
    return redirect(env("FRONTEND_URL"));
});

$router->get('/users/{id}', function($id, Request $request) {
    return response()->json(getUser($id));
});

$router->get('/user', function(Request $request) {
    return response()->json(getUser());
});

$router->post('/update-bio', function(Request $request) {
    if (!isSignedIn()) {
        return abortIfNotAuthenticated();
    }
    $user = getUserBySession();

    if (!request()->exists('bio')) {
        return response()->json(["error" => "Must specify bio field."], 400);
    } else {
        DB::update("UPDATE `users` SET bio = ? WHERE `users`.`id` = ?", [request()->input('bio'), $user['id']]);
    }

    return true;
});

$router->get('/test', function(Request $request) {
    return response()->json($_SESSION);
});

$router->post('/top', function() {
    if (!isSignedIn()) {
        return abortIfNotAuthenticated();
    }
    $user = getUserBySession();
    $api = getSpotifyApi($user['id']);

    if (request()->input('type') == NULL || !preg_match('/artists|tracks/', request()->input('type'))) {
        return response()->json(["error" => "Please specify a valid type. Must be artists or tracks."], 400);
    }

    $topResults = $api->getMyTop(request()->input('type'));

    return response()->json($topResults);
});

$router->post('/recent', function() {
    if (!isSignedIn()) {
        return abortIfNotAuthenticated();
    }
    $user = getUserBySession();
    $api = getSpotifyApi($user['id']);

    $opts;
    if (request()->input('limit') != NULL) {
        $opts["limit"] = request()->input('limit');
    }
    if (request()->input('before') != NULL) {
        $opts["before"] = request()->input('before');
    }
    if (request()->input('after') != NULL) {
        $opts["after"] = request()->input('after');
    }

    $topResults = $api->getMyRecentTracks($opts);

    return response()->json($topResults);
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

    // store new accessToken in the session
    $_SESSION['access_token'] = $session->getAccessToken();

    return $api;
}

function getUser($id=NULL) {
    if($id) {
        $result = json_decode(json_encode(DB::select("SELECT id, username, profileImageUrl, spotifyProfileUrl, email, followers, premium, bio FROM users WHERE id = ?", [$id])), true);
    } else if (isset($_SESSION['access_token'])) { // get by session
        $result = json_decode(json_encode(DB::select("SELECT id, username, profileImageUrl, spotifyProfileUrl, email, followers, premium, bio FROM users WHERE accessToken = ?", [$_SESSION['access_token']])), true);
    } else {
        return null;
    }

    if (count($result)) {
        # premium is stored as TINYINT in database, but we need it as a boolean in the JSON object we return
        $result[0]['premium'] = $result[0]['premium'] == 1;
        return $result[0];
    } else {
        return null;
    }
}

function isSignedIn() {
    return isset($_SESSION['access_token']);
}

function getUserBySession() {
    if (isSignedIn()) {
        $result = json_decode(json_encode(DB::select("SELECT id FROM users WHERE accessToken = ?", [$_SESSION['access_token']])), true)[0];
        return $result;
    } else {
        return NULL;
    }
}

function abortIfNotAuthenticated() {
    return response()->json([
        "error" => "You must be signed in to access this endpoint."
    ], 401);
}
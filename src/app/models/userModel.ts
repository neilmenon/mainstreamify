import * as moment from "moment"

export class UserModel {
    username: string
    profileImageUrl: string
    spotifyProfileUrl: string
    registeredDate: moment.Moment
    email: string
    followers: number
    premium: boolean
    bio: string


    constructor() {
        this.username = "Neil Menon"
        this.profileImageUrl = "https://lastfm.freetls.fastly.net/i/u/avatar170s/02008e31039a5ac85de35251b6cebae1.png"
        this.spotifyProfileUrl = "https://open.spotify.com/user/hindxqag4cr2giyxcn08jqtj7"
        this.registeredDate = moment()
        this.email = "test@virginia.edu"
        this.followers = 546
        this.premium = true
        this.bio = "Bio bio things";
    }
}
import * as moment from "moment"

export class UserModel {
    username: string
    profileImageUrl: string
    spotifyProfileUrl: string
    registeredDate: moment.Moment
    email: string
    followers: number
    premium: boolean
    updateEvery: number
    dontSell: boolean
    bio: string


    constructor() {
        this.username = null
        this.profileImageUrl = null
        this.spotifyProfileUrl = null
        this.registeredDate = moment()
        this.email = null
        this.followers = null
        this.premium = null
        this.updateEvery = 30;
        this.dontSell = true;
        this.bio = "Bio bio things";
    }
}
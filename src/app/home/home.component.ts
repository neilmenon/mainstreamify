import { visitAll } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { config } from '../config';
import { MessageService } from '../message.service';
import { UserModel } from '../models/userModel';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  signed_in: boolean = false
  user: UserModel
  recentForm: FormGroup
  moment: any = moment
  recentSubmitClicked: boolean
  recentErrors: Array<string> = []
  recentResults: any
  status: any
  mainstreamFactor: number
  topTracks: any = []
  topArtists: any = []

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.userService.getUser().toPromise().then((data: any) => {
      if (!data?.id) {
        this.signed_in = false
      } else {
        this.signed_in = true
        this.user = data
      }
    })

    this.recentForm = this.fb.group({
      limit: [50],
      before: [null], // end date
      after: [null] // start date
    })

    this.recentForm.valueChanges.subscribe(() => {
      this.recentErrors = []
      if (this.recentForm.controls['limit'].value < 1 || this.recentForm.controls['limit'].value > 50) {
        this.recentErrors.push("Invalid track limit. Limit must be between 1 and 50.")
      }
      if (this.recentForm.controls['before'].value && this.recentForm.controls['after'].value) {
          this.recentErrors.push("Specify either a before or after parameter, but not both")
      }
    })

    this.userService.getPlayingStatus().toPromise().then((data: any) => {
      this.status = data
    })

    this.userService.getTop("tracks").toPromise().then((data: any) => { this.topTracks = data?.items })
    this.userService.getTop("artists").toPromise().then((data: any) => { this.topArtists = data?.items })
  }

  submitRecentTracks() {
    this.recentSubmitClicked = true
    if (this.recentErrors.length == 0 && this.recentForm.valid) {
      this.getRecentTracksAJAX(
        this.recentForm.controls['limit'].value,
        this.recentForm.controls['before'].value ? this.recentForm.controls['before'].value.unix() : null,
        this.recentForm.controls['after'].value ? this.recentForm.controls['after'].value.unix() : null
      )
    }
  }

  getRecentTracksAJAX(limit: number, before: string = null, after: string = null) {
    this.messageService.open("Submitting...", "center", true)
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.open("POST", config.api_root + "/recent")
    xmlhttp.responseType = 'json';
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    xmlhttp.send(JSON.stringify({ "limit": limit, "before": before, "after": after }))
    xmlhttp.onreadystatechange = () => {
      if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          this.recentResults = xmlhttp.response?.items
          let tmp: number = 0
          this.recentResults.forEach(x => {
            tmp += x?.track?.popularity
          })
          this.mainstreamFactor = Math.ceil(tmp / limit)
          console.log(this.recentResults)
          this.messageService.open("Successfully retrieved recent tracks.")
      }
   }
  }

  signOut() {
    this.userService.signOut()
  }

  signIn() {
    this.userService.signIn()
  }

  //validate home page top form
  validate(){
    var biofield = <HTMLInputElement>document.getElementById("topinput")

    //valid input
    if(biofield.value == "artists" || biofield.value == "tracks"){
      //send get request
    }
    //invalid input
    else{
      document.getElementById("errortag").style.visibility = "visible"

    }
  }

}

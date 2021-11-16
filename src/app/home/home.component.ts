import { visitAll } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
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

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUser().toPromise().then((data: any) => {
      if (!data?.id) {
        this.signed_in = false
      } else {
        this.signed_in = true
        this.user = data
      }
    })
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

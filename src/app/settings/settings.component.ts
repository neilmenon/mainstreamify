import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MessageService } from '../message.service';
import { UserModel } from '../models/userModel';
import { UserService } from '../user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup
  showBioError: boolean
  user: UserModel
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      bio: [null, Validators.maxLength(250)]
    })
    this.settingsForm.valueChanges.pipe(debounceTime(100), distinctUntilChanged()).subscribe(() => {
      if (this.settingsForm.controls['bio'].value?.length > 250) {
        this.showBioError = true
      } else {
        this.showBioError = false
      }
    })
    
    this.userService.getUser().toPromise().then((data: any) => {
      if (data?.id) {
        this.user = data
        this.settingsForm.patchValue(this.user)
      }
    })
  }

  submitProfileBio() {
    if (this.settingsForm.valid) {
      this.messageService.open("Submitting user settings.", "center", true)
      this.userService.updateBio(this.settingsForm.controls['bio'].value).toPromise().then(() => {
        this.messageService.open("Successfully updated user settings.")
      }).catch(() => {
        this.messageService.open("There was an error updating user settings!")
      })
    }
  }

  deleteAccount() {
    this.messageService.open("Deleting Spotify account permanently (haha). This action cannot be undone :D")
    setTimeout(() => {
      this.router.navigate(['/'])
    }, 3000)
  }

  //validate profile edit and notify user of saved profile
  validateProfile(){
    var biofield = <HTMLInputElement>document.getElementById("bio")
    
    //valid inputs
    if(biofield.value.length < 500 && !biofield.value.includes("Apple Music")){
      //make post request with input fields to endpoint

      this.messageService.open("Successfully saved user settings.")
      //make saved tag visible
       document.getElementById("savedtag").style.visibility = "visible";

    }
    //invalid inputs
    else{
      //invalid bio input exceeded 500 char or contained "Apple Music"
      //displaying error tag
      document.getElementById("errortag").style.visibility = "visible";
    }
    

  }



}

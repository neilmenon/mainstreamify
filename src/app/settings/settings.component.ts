import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      timePeriod: [null],
      dontSellData: [false],
      description: []
    })
    this.settingsForm.valueChanges.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
    })
    
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

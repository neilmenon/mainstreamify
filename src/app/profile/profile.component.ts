import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from '../models/userModel';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: UserModel = new UserModel()
  
  constructor(
    public router: Router
  ) { }

  ngOnInit(): void {

  }

  goToProfile() {
    this.router.navigate(['profile/edit'])
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { UserModel } from '../models/userModel';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: UserModel = new UserModel()
  signed_in: boolean
  moment: any = moment
  
  constructor(
    public router: Router,
    private userService: UserService
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
  }

  goToProfile() {
    this.router.navigate(['profile/edit'])
  }

}

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
  }

  signOut() {
    this.userService.signOut()
  }

  signIn() {
    this.userService.signIn().toPromise().then((data: any) => {
      this.user = data
      this.signed_in = true
    })
  }

}

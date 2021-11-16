import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MessageService } from './message.service';
import { UserModel } from './models/userModel';
import { UserService } from './user.service';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: UserModel
  signed_in: boolean
  title = 'mainstreamify';

  constructor(
    private http: HttpClient, 
    private userService: UserService,
    private messageService: MessageService
  ) {
    this.userService.getUser().toPromise().then((data: any) => {
      if (!data?.id) {
        this.signed_in = false
      } else {
        this.signed_in = true
        this.user = data
      }
    }).catch(() => {
      this.messageService.open("There was an backend error getting the user!")
    })
  }
}

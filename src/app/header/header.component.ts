import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UserModel } from '../models/userModel';
import { UserService } from '../user.service';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches), shareReplay());
  moment: any = moment
  
  @Input() user: UserModel
  @Input() signed_in: boolean
  constructor(
    private breakpointObserver: BreakpointObserver,
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }
  
  signOut() {
    this.userService.signOut()
  }

}

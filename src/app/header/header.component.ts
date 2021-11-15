import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UserModel } from '../models/userModel';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  signed_in: boolean = true
  user: UserModel = new UserModel()
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches), shareReplay());
  moment: any = moment
  
  constructor(
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
  }

  toggleColor(){
    if($("nav").hasClass("navlight")){
      $("nav").removeClass("navlight")
      $("nav").addClass("navdark")
    }
    else if($("nav").hasClass("navdark")){
      $("nav").removeClass("navdark")
      $("nav").addClass("navlight")
    }
    else{
      $("nav").addClass("navdark")
    }
  }

}

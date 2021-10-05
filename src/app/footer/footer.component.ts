import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  signedIn: boolean
  constructor() { }

  ngOnInit(): void {
    this.signedIn = true
  }

}

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
      this.messageService.open("Successfully saved user settings.")
    })
  }

  deleteAccount() {
    this.messageService.open("Deleting Spotify account permanently (haha). This action cannot be undone :D")
    setTimeout(() => {
      this.router.navigate(['/'])
    }, 3000)
  }

}

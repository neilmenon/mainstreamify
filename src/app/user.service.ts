import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from './config.figs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  signIn() {
    return this.http.get(config.api_root + '/login')
  }

  signOut() {
    window.location.href = config.api_root + '/logout'
  }

  getUser(userId: string) {
    return this.http.get(config.api_root + '/users/' + userId)
  }
}

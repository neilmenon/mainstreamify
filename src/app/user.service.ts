import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from './config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  signIn() {
    window.location.href = config.api_root + '/login'
  }

  signOut() {
    window.location.href = config.api_root + '/logout'
  }

  getUser() {
    return this.http.get(config.api_root + '/user')
  }

  getPlayingStatus() {
    return this.http.get(config.api_root + '/status')
  }

  getTop(type: string) {
    return this.http.post(config.api_root + '/top', { "type": type })
  }

  updateBio(bio: string) {
    return this.http.post(config.api_root + 'api/update-bio', { bio: bio })
  }

}

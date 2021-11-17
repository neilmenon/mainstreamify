import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from './config.sample';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  signIn() {
    window.location.href = config.api_root + 'api/login'
  }

  signOut() {
    window.location.href = config.api_root + 'api/logout'
  }

  getUser() {
    return this.http.get(config.api_root + 'api/user')
  }

  updateBio(bio: string) {
    return this.http.post(config.api_root + 'api/update-bio', { bio: bio })
  }

}

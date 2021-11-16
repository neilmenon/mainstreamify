import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from './config.sample';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  signIn() {
    window.location.href = '/api/login'
  }

  signOut() {
    window.location.href = '/api/logout'
  }

  getUser() {
    return this.http.get('/api/user')
  }

  updateBio(bio: string) {
    return this.http.post('/api/update-bio', { bio: bio })
  }

}

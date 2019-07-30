import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GLOBAL } from "@app/services/global";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url: String;
  identity: Object;
  token: String;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  singUp(user, getHas?) {
    user['getHas'] = (getHas) ? getHas : null;
    const url = `${this.url}/login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post(url, user, { headers }).pipe(map(res => res));
  }

  getIdentity() {
    const identity = JSON.parse(localStorage.getItem('identity'));
    this.identity = (identity) ? identity : null; 
    return identity;
  }

  getToken() {
    const token = localStorage.getItem('token');
    this.token = (token) ? token : null; 
    return token;
  }

  registerUser(user) {
    const url = `${this.url}/register`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post(url, user, { headers }).pipe(map(res => res));
  }
} 

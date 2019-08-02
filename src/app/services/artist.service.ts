import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { GLOBAL } from '@app/services/global';
import { UserService } from '@app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  url: String = GLOBAL.url;

  constructor(private _http: HttpClient, private _userService: UserService) { }


  getArtistList(token, page) {
    const url = `${this.url}/artist-list/${page}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(url, { headers }).pipe(map(res => res));
  }

  createArtist(token, artist) {
    const url = `${this.url}/artist`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.post(url, artist, { headers }).pipe(map(res => res));
  }

  updateArtist(token, artist) {
    const url = `${this.url}/artist/${artist._id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.put(url, artist, { headers }).pipe(map(res => res));
  }

  deleteArtist(token, id) {
    const url = `${this.url}/artist/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.delete(url, { headers }).pipe(map(res => res));
  }
}

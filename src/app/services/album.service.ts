import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GLOBAL } from '@app/services/global';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  url: String = GLOBAL.url;

  constructor(private _http: HttpClient) { }

  getAlbumList(token, page, artist) {
    const url = `${this.url}/album-list/${page}/${artist}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(url, { headers }).pipe(map(res => res));
  }
}

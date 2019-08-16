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

  getAlbumList(token, page, artist?) {
    const url = (artist) ? `${this.url}/album-list/${page}/${artist}` : `${this.url}/album-list/${page}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(url, { headers }).pipe(map(res => res));
  }

  getAlbum(token, albumId) {
    const url = `${this.url}/album/${albumId}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(url, { headers }).pipe(map(res => res));
  }

  createAlbum(token, album) {
    const url = `${this.url}/album`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.post(url, album, { headers }).pipe(map(res => res));
  }

  updateAlbum(token, album) {
    const url = `${this.url}/album/${album._id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.put(url, album, { headers }).pipe(map(res => res));
  }

  deleteAlbum(token, album) {
    const url = `${this.url}/album/${album._id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.delete(url, { headers }).pipe(map(res => res));
  }
}

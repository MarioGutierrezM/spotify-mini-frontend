import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GLOBAL } from '@app/services/global';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  url: String = GLOBAL.url;

  constructor(private _http: HttpClient) { }

  getAlbumList(token, albumId) {
    const url = `${this.url}/song-list/${albumId}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(url, { headers }).pipe(map(res => res));
  }

  getSong(token, songId) {
    const url = `${this.url}/song/${songId}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(url, { headers }).pipe(map(res => res));
  }

  getSongFile(token, songName) {
    const url = `${this.url}/get-file-song/${songName}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(url, { headers }).pipe(map(res => res));
  }

  postSong(token, song) {
    const url = `${this.url}/song`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.post(url, song, { headers }).pipe(map(res => res));
  }

  updateSong(token, song) {
    const url = `${this.url}/song/${song._id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.put(url, song, { headers }).pipe(map(res => res));
  }

  deleteSong(token, song) {
    const url = `${this.url}/song/${song._id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.delete(url, { headers }).pipe(map(res => res));
  }
}

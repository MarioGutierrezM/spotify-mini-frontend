import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SongService } from '@app/services/song.service';
import { GLOBAL } from '@app/services/global';

@Component({
  selector: 'app-song-player',
  templateUrl: './song-player.component.html',
  styleUrls: ['./song-player.component.scss']
})
export class SongPlayerComponent implements OnInit {

  @ViewChild('mp3') mp3: ElementRef;
  @ViewChild('player') player: ElementRef;

  url: string = GLOBAL.url;
  songUrl: string;
  name: string = 'Title';
  artist: string = 'Artist';
  urlImg: string;
  imgDefault: string = '../../../assets/images/default-album.png';

  constructor(private _songService: SongService) { }

  ngOnInit() {
    this.urlImg = this.imgDefault;

    this._songService.songPlayed.subscribe(res => {
      this.songUrl = `${this.url}/get-file-song/${res['file']}`;
      this.name = res['name'];
      this.artist = res['artist']
      this.urlImg = (res['image']) ? res['image'] : this.imgDefault;

      document.getElementById('mp3').setAttribute('src', this.songUrl);
      (document.getElementById('player') as any).load();
      (document.getElementById('player') as any).play();
    });
  }

}

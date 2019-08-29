import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { UserService } from '@app/services/user.service';
import { AlbumService } from '@app/services/album.service';
import { SongService } from '@app/services/song.service';
import { GLOBAL } from '@app/services/global';
import { SongModalComponent } from '@app/components/common/song-modal/song-modal.component';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss']
})
export class AlbumDetailComponent implements OnInit {

  token: string;
  identity: object;

  albumData;
  songList: Array <object> = [];
  albumImgUrl = `${GLOBAL.url}/get-image-album`;
  defaultAlbumImg: string = '../../../assets/images/default-album.png';

  constructor(
    private _userService: UserService,
    private _albumService: AlbumService,
    private _songService: SongService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
    this.getArtistInfo();
  }

  getArtistInfo() {
    this.route.params.subscribe(async params => {

      const album = await this._albumService.getAlbum(this.token, params.id).toPromise();
      this.albumData = album['album'];
      this.loadAlbumImage(this.albumData);

      const songs = await this._songService.getAlbumList(this.token, params.id).toPromise();
      this.songList = songs['songsList'];
    });
  }

  loadAlbumImage(album) {
    const validation = (album.image && album.image !== 'null') ? true : false;
    const imgUrl = `${this.albumImgUrl}/${album.image}`;
    const img = (validation) ? imgUrl : this.defaultAlbumImg;
    album.image = img;
  }

  playSong(song) {
    const { artist, image } = this.albumData;
    song.artist = artist.name;
    song.image = image;
    this._songService.playSong(song);
  }

  addSong () {
    const data = {
      title: 'Create New Song',
      btnText: 'Create Song',
      alertSuccesText: 'Song has been created',
      alertErrorText: "Song couldn't be created",
      modalMode: 'create',
      album: this.albumData
    };
    this.showDialog(data);
  }

  updateSong(song: object) {
    const data = {
      title: 'Update Song',
      btnText: 'Update Song',
      alertSuccesText: 'Song has been updated',
      alertErrorText: "Song couldn't be updated",
      modalMode: 'edit',
      song
    };
    this.showDialog(data);
  }

  deleteSong(song: object) {
    const data = {
      title: 'Delete Song',
      btnText: 'Delete Song',
      alertSuccesText: 'Song has been deleted',
      alertErrorText: "Song couldn't be deleted",
      modalMode: 'delete',
      song
    };
    this.showDialog(data);
  }

  showDialog(data: object) {
    const dialog = this.dialog.open(SongModalComponent, {
      width: '40rem',
      data
    });
    dialog.afterClosed().subscribe(data => {
      this.getArtistInfo();
    });
  }

}

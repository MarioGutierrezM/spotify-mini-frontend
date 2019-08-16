import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ArtistService } from '@app/services/artist.service';
import { UserService } from '@app/services/user.service';
import { AlbumService } from '@app/services/album.service';
import { GLOBAL } from '@app/services/global';
import { AlbumModalComponent } from '@app/components/common/album-modal/album-modal.component';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.scss']
})
export class ArtistDetailComponent implements OnInit {

  token: string;
  identity: object;

  artistData;
  albumList: Array <object> = [];
  artistImgUrl: string = `${GLOBAL.url}/get-image-artist`;
  albumImgUrl = `${GLOBAL.url}/get-image-album`;
  defautlArtistImg: string = '../../../assets/images/default-artist.jpeg';
  defaultAlbumImg: string = '../../../assets/images/default-album.png';
  imgList: Array <string> = [];

  constructor(
    private _artistService: ArtistService,
    private _userService: UserService,
    private _albumService: AlbumService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
    this.getArtistInfo();
  }

  getArtistInfo() {
    this.imgList = [];
    this.route.params.subscribe(async params => {
      const artist = await this._artistService.getArtistDetail(this.token, params.id).toPromise();
      this.artistData = artist['artist'];
      this.loadArtistImage();

      const albums = await this._albumService.getAlbumList(this.token, 1, this.artistData._id).toPromise();
      this.albumList = albums['albumList'].map(album => {
        this.imgList.push(this.loadAlbumImage(album));
        return album;
      });
    });
  }

  loadArtistImage() {
    const validation = (this.artistData.image && this.artistData.image !== 'null') ? true : false;
    const imgUrl = `${this.artistImgUrl}/${this.artistData.image}`;
    this.artistData.image = (validation) ? imgUrl : this.defautlArtistImg;
  }

  loadAlbumImage(album) {
    const validation = (album.image && album.image !== 'null') ? true : false;
    const imgUrl = `${this.albumImgUrl}/${album.image}`;
    const img = (validation) ? imgUrl : this.defaultAlbumImg;
    return img;
  }

  addAlbum() {
    const dialogRef = this.dialog.open(AlbumModalComponent, {
      width: '40rem',
      data: {
        title: 'Create New Album',
        btnText: 'Create Album',
        alertSuccesText: 'Album has been created',
        alertErrorText: "Album couldn't be created",
        modalMode: 'create',
        artist: this.artistData
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getArtistInfo();
    });
  }

  updateAlbum(album) {
    const dialogRef = this.dialog.open(AlbumModalComponent, {
      width: '40rem',
      data: {
        title: 'Update Album',
        btnText: 'Update Album',
        alertSuccesText: 'Album has been updated',
        alertErrorText: "Album couldn't be updated",
        modalMode: 'edit',
        artist: this.artistData,
        album
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getArtistInfo();
    });
  }

  deleteAlbum(album) {
    const dialogRef = this.dialog.open(AlbumModalComponent, {
      width: '40rem',
      data: {
        title: 'Delete Album',
        btnText: 'Delete Album',
        alertSuccesText: 'Album has been deleted',
        alertErrorText: "Album couldn't be deleted",
        modalMode: 'delete',
        artist: this.artistData,
        album
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getArtistInfo();
    });
  }

  goToAlbum(album) {
    const { _id } = album;
    const url = `/album/${_id}`
    this.router.navigate([url]);
  }
 
}

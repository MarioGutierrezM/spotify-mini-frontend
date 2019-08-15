import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistService } from '@app/services/artist.service';
import { UserService } from '@app/services/user.service';
import { AlbumService } from '@app/services/album.service';
import { GLOBAL } from '@app/services/global';

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
  defautlArtistImg = '../../../assets/images/default-artist.jpeg';
  defaultAlbumImg = '../../../assets/images/default-album.png';

  constructor(
    private _artistService: ArtistService,
    private _userService: UserService,
    private _albumService: AlbumService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
    this.getArtistInfo();
  }

  getArtistInfo() {
    this.route.params.subscribe(async params => {
      const artist = await this._artistService.getArtistDetail(this.token, params.id).toPromise();
      this.artistData = artist['artist'];
      this.loadArtistImage();

      const albums = await this._albumService.getAlbumList(this.token, 1, this.artistData._id).toPromise();
      this.albumList = albums['albumList'].map(album => {
        album.image = this.loadAlbumImage(album);
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
 
}

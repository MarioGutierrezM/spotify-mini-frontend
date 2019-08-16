import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Artist } from '@app/models/artist';
import { GLOBAL } from '@app/services/global';
import { Router } from '@angular/router';
import { Album } from '@app/models/album';

@Component({
  selector: 'app-artist-item',
  templateUrl: './artist-item.component.html',
  styleUrls: ['./artist-item.component.scss']
})
export class ArtistItemComponent implements OnInit {

  @Input() artist: Artist;
  @Input() album: Album;
  @Input() userRole: string;
  @Output() updateArtistOut = new EventEmitter();
  @Output() deleteArtistOut = new EventEmitter();
  @Output() goToPage = new EventEmitter();

  url: String = GLOBAL.url;
  imageUrl: String;
  showOptions: Boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
    if (this.artist) {
      this.imageUrl = (this.artist.image && this.artist.image !== 'null') 
        ? `${this.url}/get-image-artist/${this.artist.image}`
        : `../../../../assets/images/default-artist.jpeg`;
    }

    if (this.album) {
      this.imageUrl = (this.album.image && this.album.image !== 'null') 
        ? `${this.url}/get-image-album/${this.album.image}`
        : `../../../../assets/images/default-album.png`;
    }
  }

  onMouseOver() {
    this.showOptions = true;
  }

  onMouseOut() {
    this.showOptions = false;
  }

  updateArtist() {
    const param = (this.artist) ? this.artist : this.album;
    this.updateArtistOut.emit(param);
  }

  deleteArtist() {
    const param = (this.artist) ? this.artist : this.album;
    this.deleteArtistOut.emit(param);
  }

  goArtistDetail() {
    if (this.artist) {
      const { _id } = this.artist;
      const url = `/artist/${_id}`
      this.router.navigate([url]);
    }

    if (this.album) {
      const { _id } = this.album;
      const url = `/album/${_id}`
      this.router.navigate([url]);
    }
  }

}

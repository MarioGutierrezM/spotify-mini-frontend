import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Artist } from '@app/models/artist';
import { GLOBAL } from '@app/services/global';

@Component({
  selector: 'app-artist-item',
  templateUrl: './artist-item.component.html',
  styleUrls: ['./artist-item.component.scss']
})
export class ArtistItemComponent implements OnInit {

  @Input() artist: Artist;
  @Output() updateArtistOut = new EventEmitter();
  @Output() deleteArtistOut = new EventEmitter();

  url: String = GLOBAL.url;
  imageUrl: String;
  showOptions: Boolean = false;

  constructor() { }

  ngOnInit() {
    this.imageUrl = (this.artist.image && this.artist.image !== 'null') 
      ? `${this.url}/get-image-artist/${this.artist.image}`
      : `../../../../assets/images/default-user.png`;
  }

  onMouseOver() {
    this.showOptions = true;
  }

  onMouseOut() {
    this.showOptions = false;
  }

  updateArtist() {
    this.updateArtistOut.emit(this.artist);
  }

  deleteArtist() {
    this.deleteArtistOut.emit(this.artist);
  }

}

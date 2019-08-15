import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Artist } from '@app/models/artist';
import { GLOBAL } from '@app/services/global';
import { Router } from '@angular/router';

@Component({
  selector: 'app-artist-item',
  templateUrl: './artist-item.component.html',
  styleUrls: ['./artist-item.component.scss']
})
export class ArtistItemComponent implements OnInit {

  @Input() artist: Artist;
  @Input() userRole: string;
  @Output() updateArtistOut = new EventEmitter();
  @Output() deleteArtistOut = new EventEmitter();

  url: String = GLOBAL.url;
  imageUrl: String;
  showOptions: Boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.imageUrl = (this.artist.image && this.artist.image !== 'null') 
      ? `${this.url}/get-image-artist/${this.artist.image}`
      : `../../../../assets/images/default-artist.jpeg`;
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

  goArtistDetail() {
    const { _id } = this.artist;
    const url = `/artist/${_id}`
    this.router.navigate([url]);
  }

}

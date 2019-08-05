import { Component, OnInit } from '@angular/core';
import { GLOBAL } from '@app/services/global';
import { MatDialog } from '@angular/material';
import { UserService } from '@app/services/user.service';
import { ArtistService } from '@app/services/artist.service';
import { ArtistModalComponent } from '@app/components/common/artist-modal/artist-modal.component'

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.scss']
})
export class ArtistListComponent implements OnInit {

  token: String;
  identity: Object;
  url = GLOBAL.url;

  artistList: Array<any> = [];
  totalItems: Number = 0;

  currentPage: number = 1;

  constructor(
    private _userService: UserService,
    private _artistService: ArtistService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
    this.getArtistList(1);
  }

  getArtistList(page) {
    this._artistService.getArtistList(this.token, page).subscribe(
      res => {
        this.artistList = res['artistList'];
        this.totalItems = res['totalItems'];
      },
      err => {}
    );
  }

  addArtist() {
    const dialogRef = this.dialog.open(ArtistModalComponent, {
      width: '40rem',
      data: {
        title: 'Create New Artist',
        btnText: 'Create Artist',
        alertSuccesText: 'Artist has been created',
        alertErrorText: "Artist couldn't be created",
        modalMode: 'create'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getArtistList(this.currentPage);
    });
  }

  updateArtist(artist) {
    const dialogRef = this.dialog.open(ArtistModalComponent, {
      width: '40rem',
      data: {
        title: 'Edit Artist',
        btnText: 'Edit Artist',
        alertSuccesText: 'Artist has been edited',
        alertErrorText: "Artist couldn't be edited",
        modalMode: 'edit',
        artist
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getArtistList(this.currentPage);
    });
  }

  deleteArtist(artist) {
    const dialogRef = this.dialog.open(ArtistModalComponent, {
      width: '40rem',
      data: {
        title: 'Delete Artist',
        btnText: 'Delete Artist',
        alertSuccesText: 'Artist has been deleted',
        alertErrorText: "Artist couldn't be deleted",
        modalMode: 'delete',
        artist
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getArtistList(this.currentPage);
    });
  }

  goToPage(page) {
    this.getArtistList(page);
    this.currentPage = page;
  }

}

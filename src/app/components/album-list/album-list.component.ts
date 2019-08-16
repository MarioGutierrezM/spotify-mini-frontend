import { Component, OnInit } from '@angular/core';
import { GLOBAL } from '@app/services/global';
import { MatDialog } from '@angular/material';
import { UserService } from '@app/services/user.service';
import { AlbumService } from '@app/services/album.service';
import { AlbumModalComponent } from '@app/components/common/album-modal/album-modal.component';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.scss']
})
export class AlbumListComponent implements OnInit {

  token: String;
  identity: Object;
  url = GLOBAL.url;

  albumList: Array<any> = [];
  totalItems: Number = 0;

  currentPage: number = 1;

  constructor(
    private _userService: UserService,
    private _albumService: AlbumService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
    this.getAlbumList(1);
  }

  getAlbumList(page) {
    this._albumService.getAlbumList(this.token, page).subscribe(
      res => {
        this.albumList = res['albumList'];
        this.totalItems = res['totalItems'];
      },
      err => {}
    );
  }

  // addAlbum(album) {
  //   const dialogRef = this.dialog.open(AlbumModalComponent, {
  //     width: '40rem',
  //     data: {
  //       title: 'Create New Album',
  //       btnText: 'Create Album',
  //       alertSuccesText: 'Album has been created',
  //       alertErrorText: "Album couldn't be created",
  //       modalMode: 'create',
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(data => {
  //     this.getAlbumList(this.currentPage);
  //   });
  // }

  updateAlbum(album) {
    const dialogRef = this.dialog.open(AlbumModalComponent, {
      width: '40rem',
      data: {
        title: 'Update Album',
        btnText: 'Update Album',
        alertSuccesText: 'Album has been updated',
        alertErrorText: "Album couldn't be updated",
        modalMode: 'edit',
        artist: { _id: album.artist },
        album
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getAlbumList(this.currentPage);
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
        album
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getAlbumList(this.currentPage);
    });
  }

  goToPage(page) {
    this.getAlbumList(page);
    this.currentPage = page;
  }

}

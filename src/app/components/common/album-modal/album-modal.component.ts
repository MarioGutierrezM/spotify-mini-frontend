import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '@app/services/user.service';
import { AlbumService } from '@app/services/album.service';
import { GLOBAL } from '@app/services/global';

@Component({
  selector: 'app-album-modal',
  templateUrl: './album-modal.component.html',
  styleUrls: ['./album-modal.component.scss']
})
export class AlbumModalComponent implements OnInit {

  identity: Object;
  token: string;
  alertMessage: String;
  alertSuccess: Boolean;
  url: String = GLOBAL.url;
  imageUrl: String;
  albumForm: FormGroup;

  title: string;
  btnText: string;
  alertSuccesText: string;
  alertErrorText: string;
  modalMode: string;

  filesToUpload;

  constructor(
    public dialogRef: MatDialogRef<AlbumModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _userService: UserService,
    private _albumService: AlbumService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.token = this._userService.getToken();
    this.identity = this._userService.getToken();
    const isDisabled = (this.data.modalMode === 'delete') ? true : false;
    this.albumForm = this.formBuilder.group({
      title: [{ value: '', disabled: isDisabled }, Validators.required],
      description: [{ value: '', disabled: isDisabled }, Validators.required],
      year: [{ value: '', disabled: isDisabled }, Validators.required],
      image: [''],
      _id: [''],
      artist: [{ value: '', disabled: isDisabled }]
    });
    this.loadModalTexts();
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, artist, album } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;

    if(album) {
      const { title, description, image, _id, year } = album;
      
      this.albumForm.patchValue({ title, description, image, _id, year });
      const webImage = `${this.url}/get-image-album/${image}`;
      const defaultImage = '../../../../assets/images/default-album.png';
      this.imageUrl = (image && image !== 'null') ? webImage : defaultImage;
    }

    if(artist) {
      const { name, _id } = artist;
      this.albumForm.patchValue({ artist: _id });
    }
  }

  onSubmit() {
    let endpoint;
    switch(this.modalMode) {
      case 'create': endpoint = this._albumService.createAlbum(this.token, this.albumForm.value);
      break;
      case 'edit': endpoint = this._albumService.updateAlbum(this.token, this.albumForm.value);
      break;
      case 'delete': endpoint = this._albumService.deleteAlbum(this.token, this.albumForm.value);
      break;
    }

    endpoint.subscribe(
      res => {
        this.fileRequest();
      },
      err => {
        this.showAlert(this.alertErrorText, false);
      }
    );
  }

  showAlert(message, isSuccess) {
    this.alertMessage = message;
    this.alertSuccess = isSuccess;
  }

  closeModal() {
    this.dialogRef.close();
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }


  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {

    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append('image', files[0], files[0].name);
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      }
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', this.token);
      xhr.send(formData);
    });
  }

  fileRequest() {
    if (this.filesToUpload) {
      const id = this.albumForm.value._id;
      this.makeFileRequest(`${this.url}/upload-image-album/${id}`, [], this.filesToUpload)
      .then(result => {
        this.showAlert(this.alertSuccesText + 'With Image', true);
      }).catch(err => {
        this.showAlert(this.alertErrorText, false);
      });
    } else {
      this.showAlert(this.alertSuccesText, true);
    }
  }

}

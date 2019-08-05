import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '@app/services/user.service';
import { ArtistService } from '@app/services/artist.service';
import { GLOBAL } from '@app/services/global';

@Component({
  selector: 'app-artist-modal',
  templateUrl: './artist-modal.component.html',
  styleUrls: ['./artist-modal.component.scss']
})
export class ArtistModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ArtistModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _userService: UserService,
    private _artistService: ArtistService,
    private formBuilder: FormBuilder
  ) { }

  identity: Object;
  token: string;
  alertMessage: String;
  alertSuccess: Boolean;
  url: String = GLOBAL.url;
  imageUrl: String;

  artistForm: FormGroup;

  title: String;
  btnText: String;
  alertSuccesText: String;
  alertErrorText: String;
  modalMode: String;

  filesToUpload: Array<File>;

  ngOnInit() {
    this.token = this._userService.getToken();
    this.identity = this._userService.getToken();
    const isDisabled = (this.data.modalMode === 'delete') ? true : false;
    this.artistForm = this.formBuilder.group({
      name: [{ value: '', disabled: isDisabled }, Validators.required],
      description: [{ value: '', disabled: isDisabled }, Validators.required],
      image: [''],
      _id: ['']
    });
    this.loadModalTexts();
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, artist } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;

    if(artist) {
      const { name, description, image, _id } = artist;
      this.artistForm.patchValue({ name, description, image, _id });
      const webImage = `${this.url}/get-image-artist/${image}`;
      const defaultImage = '../../../../assets/images/default-user.png';
      this.imageUrl = (image && image !== 'null') ? webImage : defaultImage;
    }
  }

  onSubmit() {
    let endpoint;
    switch(this.modalMode) {
      case 'create': endpoint = this._artistService.createArtist(this.token, this.artistForm.value);
      break;
      case 'edit': endpoint = this._artistService.updateArtist(this.token, this.artistForm.value);
      break;
      case 'delete': endpoint = this._artistService.deleteArtist(this.token, this.artistForm.value);
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
      const id = this.artistForm.value._id;
      this.makeFileRequest(`${this.url}/upload-image-artist/${id}`, [], this.filesToUpload)
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

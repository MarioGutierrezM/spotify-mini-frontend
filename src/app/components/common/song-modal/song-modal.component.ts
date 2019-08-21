import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UserService } from '@app/services/user.service';
import { SongService } from '@app/services/song.service';
import { GLOBAL } from '@app/services/global';

@Component({
  selector: 'app-song-modal',
  templateUrl: './song-modal.component.html',
  styleUrls: ['./song-modal.component.scss']
})
export class SongModalComponent implements OnInit {

 
  constructor(
    public dialogRef: MatDialogRef<SongModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _userService: UserService,
    private _songService: SongService,
    private formBuilder: FormBuilder
  ) { }

  identity: Object;
  token: string;
  alertMessage: String;
  alertSuccess: Boolean;
  url: String = GLOBAL.url;
  imageUrl: String;

  hasFile: boolean;
  iconFile: string;

  songForm: FormGroup;
  songFormInputs: Array<object> = [];

  // dialog variables from data
  title: String;
  btnText: String;
  alertSuccesText: String;
  alertErrorText: String;
  modalMode: String;

  filesToUpload: Array<File>;

  ngOnInit() {
    this.token = this._userService.getToken();
    this.identity = this._userService.getToken();

    this.songForm = this.buildForm();
    this.loadModalTexts();
  }

  buildForm(): FormGroup {
    const isDisabled = (this.data.modalMode === 'delete') ? true : false;
    return this.formBuilder.group({
      number: [{ value: '', disabled: isDisabled }, Validators.required],
      name: [{ value: '', disabled: isDisabled }, Validators.required],
      duration: [{ value: '', disabled: isDisabled }, Validators.required],
      album: [{ value: '', disabled: isDisabled }, Validators.required],
      file: [{ value: '', disabled: isDisabled }],
      _id: ['']
    });
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, album, song } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;

    if(song) {
      const { name, duration, number, _id, file, album } = song;
      const validation = file && file !== 'null';

      this.hasFile = (validation) ? true : false;
      this.iconFile = (validation) ? 'check_box' : 'check_box_outline_blank';
      this.songForm.patchValue({ name, duration, number, _id, file, album });
    }

    if(album) {
      const { _id } = album;
      this.songForm.patchValue({ album: _id });
    }
  }

  onSubmit() {
    let endpoint;
    switch(this.modalMode) {
      case 'create': endpoint = this._songService.postSong(this.token, this.songForm.value);
      break;
      case 'edit': endpoint = this._songService.updateSong(this.token, this.songForm.value);
      break;
      case 'delete': endpoint = this._songService.deleteSong(this.token, this.songForm.value);
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

      formData.append('file', files[0], files[0].name);
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
      const id = this.songForm.value._id;
      this.makeFileRequest(`${this.url}/upload-file-song/${id}`, [], this.filesToUpload)
      .then(result => {
        if (result['song']) {
          this.showAlert(this.alertSuccesText + 'With Song', true);
        } else {
          this.showAlert(result['message'], false);
        }
      }).catch(err => {
        this.showAlert(this.alertErrorText, false);
      });
    } else {
      this.showAlert(this.alertSuccesText, true);
    }
  }

}

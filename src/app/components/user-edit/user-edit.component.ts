import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/services/user.service';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { User } from '@app/models/user';
import { GLOBAL } from '@app/services/global';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  title: String = 'Update my Info';
  // user: User;
  updateForm: FormGroup;
  identity;
  token;
  url = GLOBAL.url;

  alertUpdate: String;
  alertSuccess: Boolean;

  filesToUpload: Array<File>;

  constructor(private _userService: UserService, private formBuilder: FormBuilder) { }

  async ngOnInit() {
    this.updateForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      image: ['']
    });

    this.identity = await this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.completeForm();
  }
  
  completeForm() {
    const { name, surname, email, image } = this.identity;
    this.updateForm.patchValue({ name, surname, email, image });
  }

  onSubmitUpdate() {
    const { _id } = this.identity;

    this._userService.updateUser(this.updateForm.value, _id).subscribe(
      res => {

        if (this.filesToUpload) {
          this.makeFileRequest(`${this.url}/upload-image-user/${_id}`, [], this.filesToUpload)
          .then(result => {
            const identity = result['userUpdated'];
            const { name, surname, email, image } = identity;
            localStorage.setItem('identity', JSON.stringify(identity));
            this.updateForm.patchValue({ name, surname, email, image });
            this.showNotification('User and Image updated', true);
            this._userService.updateIdentity(identity);
          }).catch(err => {
            this.showNotification('User could not be updated', false);
          });
        } else {
          this.showNotification(res['message'], true);
          const identity = res['user'];
          localStorage.setItem('identity', JSON.stringify(identity));
          this._userService.updateIdentity(identity);
        }
      },
      err => { this.showNotification('User could not be updated', false) }
    );
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

  showNotification(message, isSuccess) {
    this.alertUpdate = message;
    this.alertSuccess = isSuccess;
  }

}

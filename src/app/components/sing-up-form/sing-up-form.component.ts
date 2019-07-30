import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { User } from '@app/models/user';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-sing-up-form',
  templateUrl: './sing-up-form.component.html',
  styleUrls: ['./sing-up-form.component.scss']
})
export class SingUpFormComponent implements OnInit {

  @Output() identityOut = new EventEmitter();

  user: User;
  userRegister: User;
  alertRegister: String;
  alertSuccess: Boolean;
  logInFrom: Boolean = true;

  constructor(private _userService: UserService) {
    this.user = new User();
    this.userRegister = new User();
  }

  ngOnInit() {
  }

  onSubmit() {
    this.alertRegister = null;
    this._userService.singUp(this.user).subscribe(
      res => {
        const identity = res['user'];
        const token = res['token'];
        if (!token) {
          alert("User could not log in succefully");
        } else {
          localStorage.setItem('identity', JSON.stringify(identity));
          localStorage.setItem('token', token);
          this.userRegister = new User();
          this.identityOut.emit({ identity, token })
        }
      }, 
      error => {
        this.alertRegister = error.error.error;
        this.alertSuccess = false;;
      }
    );
  }

  onSubmitRegister() {
    this._userService.registerUser(this.userRegister).subscribe(
      res => {
        this.alertRegister = `User registered successfully: ${res['user'].email}`;
        this.alertSuccess = true;
        this.userRegister = new User();
      },
      error => {
        this.alertRegister = error.error.msg.name;
        this.alertSuccess = false;
      }
    );
  }

  changeForm() {
    this.logInFrom = !this.logInFrom;
    this.alertRegister = null;
  }

}

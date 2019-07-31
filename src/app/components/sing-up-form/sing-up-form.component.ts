import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { User } from '@app/models/user';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-sing-up-form',
  templateUrl: './sing-up-form.component.html',
  styleUrls: ['./sing-up-form.component.scss']
})
export class SingUpFormComponent implements OnInit {

  @Output() identityOut = new EventEmitter();

  alertRegister: String;
  alertSuccess: Boolean;
  isLogInFrom: Boolean = true;
  samePassword: Boolean = true;

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(private _userService: UserService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['' , [Validators.email, Validators.required] ],
      password: ['' , Validators.required],
    });
    this.registerForm = this.formBuilder.group({
      name: ['' , Validators.required],
      surname: ['' , Validators.required],
      email: ['' , [Validators.email, Validators.required] ],
      password: ['' , Validators.required],
      confirmPassword: ['' , Validators.required],
    });
  }

  onSubmit() {
    this.alertRegister = null;
    this._userService.singUp(this.loginForm.value).subscribe(
      res => {
        const identity = res['user'];
        const token = res['token'];
        if (!token) {
          this.alertRegister = "User could not log in succefully";
        } else {
          localStorage.setItem('identity', JSON.stringify(identity));
          localStorage.setItem('token', token);
          this.registerForm.reset();
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
    this._userService.registerUser(this.registerForm.value).subscribe(
      res => {
        this.alertRegister = `User registered successfully: ${res['user'].email}`;
        this.alertSuccess = true;
      },
      error => {
        this.alertRegister = error.error.msg.name;
        this.alertSuccess = false;
      }
    );
  }

  changeForm() {
    this.isLogInFrom = !this.isLogInFrom;
    this.alertRegister = null;
    this.loginForm.reset();
    this.registerForm.reset();
  }

  comparePasswords() {
    const pass1 = this.registerForm.value.password;
    const pass2 = this.registerForm.value.confirmPassword;
    this.samePassword = (pass1 === pass2) ? true : false;
  }

}

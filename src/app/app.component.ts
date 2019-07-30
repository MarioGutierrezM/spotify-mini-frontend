import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title: String = 'spotify-mini-frontend';
  identity;
  token;

  constructor(private _userService: UserService) { }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('identity');
    this.identity = null;
    this.token = null;
  }

  identityFromForm(event) {
    this.identity = event.identity;
    this.token = event.token;
  }
}

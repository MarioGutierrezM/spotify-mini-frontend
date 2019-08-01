import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/services/user.service';
import { GLOBAL } from '@app/services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title: String = 'spotify-mini';
  identity;
  token;
  url: String = GLOBAL.url;
  identityObs: any;

  constructor(private _userService: UserService) { }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.identityObs = this._userService.getIdentityUpdated().subscribe(res => {
      this.identity = this._userService.getIdentity();
    });
  }

  ngOnDestroy() {
    this.identityObs.unsubscribe();
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

import { Component, OnInit } from '@angular/core';
import { GLOBAL } from '@app/services/global';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  token: String;
  identity: Object;
  url = GLOBAL.url;

  constructor(private _userService: UserService) { }

  ngOnInit() {
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
    console.log(this.identity);
  }

}

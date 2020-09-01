import { Component } from '@angular/core';
import { UserData } from '../../providers/user-data';

@Component({
  templateUrl: 'tabs-page.html',
  styleUrls: ['./tabs-page.scss']
})
export class TabsPage {
  signedIn = false;
  user: any;

  private setUser() {
    this.userData.user().then((user) => this.user = user);
    this.userData.isSignedIn().then((val) => this.signedIn = val);
  }

  constructor(public userData: UserData) {
    this.setUser();
    window.addEventListener('user:signin', () => this.setUser());
  }
}

import { Component } from '@angular/core';
import Repository from '../../repository';

@Component({
  templateUrl: 'tabs-page.html',
  styleUrls: ['./tabs-page.scss']
})
export class TabsPage {
  signedIn = false;
  user: any;

  private setUser() {
    this.repository.user().then((user) => this.user = user);
    this.repository.isSignedIn().then((val) => this.signedIn = val);
  }

  constructor(public repository: Repository) {
    this.setUser();
    window.addEventListener('user:signin', () => this.setUser());
  }
}

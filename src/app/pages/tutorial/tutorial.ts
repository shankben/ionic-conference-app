import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MenuController, IonSlides } from '@ionic/angular';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
  styleUrls: ['./tutorial.scss'],
})
export class TutorialPage {
  showSkip = true;

  @ViewChild('slides', { static: true }) slides: IonSlides;

  constructor(
    public menu: MenuController,
    public router: Router,
    public storage: Storage
  ) {}

  async startApp() {
    await this.router.navigateByUrl('/app/tabs/schedule', { replaceUrl: true });
    this.storage.set('ion_did_tutorial', true);
  }

  async onSlideChangeStart(event: any) {
    this.showSkip = await event.target.isEnd();
  }

  async ionViewWillEnter() {
    const res = await this.storage.get('ion_did_tutorial');
    if (res === true) {
      this.router.navigateByUrl('/app/tabs/schedule', { replaceUrl: true });
    }
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }
}

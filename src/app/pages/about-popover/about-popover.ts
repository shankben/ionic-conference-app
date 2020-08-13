import { PopoverController } from '@ionic/angular';

import { Component } from '@angular/core';

@Component({
  templateUrl: 'about-popover.html'
})
export class PopoverPage {
  constructor(public popoverCtrl: PopoverController) {}

  support() {
    // this.app.getRootNavs()[0].push('/support');
    this.popoverCtrl.dismiss();
  }

  close(url: string) {
    window.open(url, '_blank');
    this.popoverCtrl.dismiss();
  }
}

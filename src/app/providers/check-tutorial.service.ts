import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class CheckTutorial implements CanLoad {
  constructor(private storage: Storage, private router: Router) {}

  async canLoad() {
    const res = await this.storage.get('ion_did_tutorial');
    if (res) {
      this.router.navigate(['/app', 'tabs', 'schedule']);
    }
    return !res;
  }
}

import { MenuController, Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import { User } from './interfaces/user';
import { UserData } from './providers/user-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  signedIn = false;
  dark = false;
  user: User;

  private updateSignedInStatus(signedIn: boolean) {
    this.signedIn = signedIn;
  }

  private listenForSignInEvents() {
    window.addEventListener('user:signin', () =>
      this.updateSignedInStatus(true));
    window.addEventListener('user:signup', () =>
      this.updateSignedInStatus(true));
    window.addEventListener('user:signout', () =>
      this.updateSignedInStatus(false));
  }

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private userData: UserData,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
  ) {
    this.initializeApp();
  }

  private async initializeApp() {
    await this.platform.ready();
    this.statusBar.styleDefault();
    this.splashScreen.hide();
    this.user = await this.userData.user();
    window.addEventListener('user:signin', () =>
      this.userData.user().then((user) => this.user = user));
  }

  async ngOnInit() {
    this.listenForSignInEvents();
    this.swUpdate.available.subscribe(async () => {
      const toast = await this.toastCtrl.create({
        message: 'Update available!',
        position: 'bottom',
        buttons: [ { role: 'cancel', text: 'Reload' } ]
      });
      await toast.present();
      await toast.onDidDismiss();
      await this.swUpdate.activateUpdate();
      window.location.reload();
    });
    await this.checkSignInStatus();
  }

  async checkSignInStatus() {
    this.signedIn = await this.userData.isSignedIn();
  }

  async signOut() {
    await this.userData.signOut();
    return this.router.navigateByUrl('/app/tabs/schedule');
  }

  async openTutorial() {
    this.menu.enable(false);
    this.storage.set('ion_did_tutorial', false);
    this.router.navigateByUrl('/tutorial');
  }
}

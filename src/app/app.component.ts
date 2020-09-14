import { MenuController, Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

import {
  Component,
  OnInit,
  Inject,
  AfterViewInit,
  ViewEncapsulation
} from '@angular/core';
import { DOCUMENT} from '@angular/common';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import { User } from './interfaces/user';
import { UserData } from './providers/user-data';
import { ConferenceData } from './providers/conference-data';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit {
  dark = environment.provider === 'firebase';
  signedIn = false;
  user: User;
  weather: any;

  get logo() {
    return `/assets/img/${(!this.dark ?
      'amplify' :
      'firebase'
    )}-symbol-logo.png`;
  }

  private listenForSignInEvents() {
    const updateUserStatus = () => {
      this.signedIn = true;
      this.userData.user().then((user) => this.user = user);
    };
    window.addEventListener('user:signin', updateUserStatus);
    window.addEventListener('user:signup', updateUserStatus);
    window.addEventListener('user:signout', () => this.signedIn = false);
  }

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private userData: UserData,
    private conferenceData: ConferenceData,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
  ) {
    this.initializeApp();
  }

  private loadData() {
    this.userData.user().then((res) => this.user = res);
    this.conferenceData.getLocations().subscribe((locations: any) => {
      const center = locations.find((it: any) => it.center);
      this.weather = center.weather;
    });
  }

  private async initializeApp() {
    await this.platform.ready();
    await this.storage.set('isDarkTheme', this.dark);
    this.statusBar.styleDefault();
    this.splashScreen.hide();
  }

  async ngOnInit() {
    this.loadData();
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

  async ngAfterViewInit() {
    const appEl = this.doc.querySelector('ion-app');
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const el = mutation.target as HTMLElement;
          const isDark = el.classList.contains('dark-theme');
          window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { isDark }
          }));
          this.loadData();
        }
      });
    });

    observer.observe(appEl, {
      attributes: true
    });
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

import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  AlertController,
  IonList,
  IonRouterOutlet,
  LoadingController,
  ModalController,
  ToastController,
  Config
} from '@ionic/angular';

import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';

import Repository from '../../repository';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
  styleUrls: ['./schedule.scss'],
})
export class SchedulePage implements OnInit {
  @ViewChild('scheduleList', { static: true }) scheduleList: IonList;

  ios: boolean;
  queryText = '';
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = [];
  confDate: string;
  showSearchbar: boolean;

  constructor(
    public config: Config,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public modalController: ModalController,
    public toastController: ToastController,
    public router: Router,
    public routerOutlet: IonRouterOutlet,
    public repository: Repository
  ) {
    window.addEventListener('themeChanged', async () => {
      await this.updateSchedule();
    });
  }

  async ngOnInit() {
    await this.updateSchedule();
    this.ios = this.config.get('mode') === 'ios';
  }

  async updateSchedule() {
    if (this.scheduleList) {
      this.scheduleList.closeSlidingItems();
    }
    (await this.repository.listSessions(
      this.queryText,
      this.excludeTracks,
      this.segment
    )).subscribe((data: any) => {
      this.shownSessions = data.shownSessions;
      this.groups = data.groups;
    });
  }

  async presentFilter() {
    const modal = await this.modalController.create({
      component: ScheduleFilterPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { excludedTracks: this.excludeTracks }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.excludeTracks = data;
      await this.updateSchedule();
    }
  }

  async addFavorite(slidingItem: HTMLIonItemSlidingElement, sessionData: any) {
    const hasFavorite = await this.repository.hasFavorite(sessionData.name);
    if (hasFavorite) {
      await this.removeFavorite(
        slidingItem,
        sessionData,
        'Favorite already added'
      );
    } else {
      await this.repository.addFavorite(sessionData.name);
      slidingItem.close();
      const toast = await this.toastController.create({
        header: `${sessionData.name} was successfully added as a favorite.`,
        duration: 3000,
        buttons: [{
          text: 'Close',
          role: 'cancel'
        }]
      });
      await toast.present();
    }
  }

  async removeFavorite(
    slidingItem: HTMLIonItemSlidingElement,
    sessionData: any,
    title: string
  ) {
    const alert = await this.alertController.create({
      header: title,
      message: 'Would you like to remove this session from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => slidingItem.close()
        },
        {
          text: 'Remove',
          handler: async () => {
            await this.repository.removeFavorite(sessionData.name);
            await this.updateSchedule();
            slidingItem.close();
          }
        }
      ]
    });
    await alert.present();
  }

  async openSocial(network: string, fab: HTMLIonFabElement) {
    const loading = await this.loadingController.create({
      message: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    await loading.present();
    await loading.onWillDismiss();
    fab.close();
  }
}

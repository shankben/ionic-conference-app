import { Component } from '@angular/core';
import { Config, ModalController, NavParams } from '@ionic/angular';

import Repository from '../../repository';


@Component({
  selector: 'page-schedule-filter',
  templateUrl: 'schedule-filter.html',
  styleUrls: ['./schedule-filter.scss'],
})
export class ScheduleFilterPage {
  ios: boolean;

  tracks: {name: string, icon: string, isChecked: boolean}[] = [];

  constructor(
    public repository: Repository,
    private config: Config,
    public modalCtrl: ModalController,
    public navParams: NavParams
  ) { }

  ionViewWillEnter() {
    this.ios = this.config.get('mode') === `ios`;

    const excludedTrackNames = this.navParams.get('excludedTracks');

    this.repository.listTracks().subscribe((tracks: any[]) => {
      tracks.forEach((track) => this.tracks.push({
        ...track,
        isChecked: (excludedTrackNames.indexOf(track.name) === -1)
      }));
    });
  }

  selectAll(check: boolean) {
    this.tracks.forEach((track) => track.isChecked = check);
  }

  applyFilters() {
    const excludedTrackNames = this.tracks
      .filter((it) => !it.isChecked)
      .map((it) => it.name);
    this.dismiss(excludedTrackNames);
  }

  dismiss(data?: any) {
    this.modalCtrl.dismiss(data);
  }
}

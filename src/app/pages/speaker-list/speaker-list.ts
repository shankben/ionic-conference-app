import { Component } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';

@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html',
  styleUrls: ['./speaker-list.scss'],
})
export class SpeakerListPage {
  speakers: any[] = [];

  private load() {
    this.conferenceData.getSpeakers()
      .subscribe((speakers: any[]) => this.speakers = speakers);
  }

  constructor(public conferenceData: ConferenceData) {
    window.addEventListener('themeChanged', () => this.load());
  }

  ionViewDidEnter() {
    this.load();
  }
}

import { Component } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';

@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html',
  styleUrls: ['./speaker-list.scss'],
})
export class SpeakerListPage {
  speakers: any[] = [];

  constructor(public conferenceData: ConferenceData) {}

  ionViewDidEnter() {
    this.conferenceData.getSpeakers().subscribe((speakers: any[]) => {
      this.speakers = speakers;
    });
  }
}

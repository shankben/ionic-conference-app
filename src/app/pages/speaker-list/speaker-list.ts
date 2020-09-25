import { Component } from '@angular/core';
import Repository from '../../repository';

@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html',
  styleUrls: ['./speaker-list.scss'],
})
export class SpeakerListPage {
  speakers: any[] = [];

  private load() {
    this.repository.listSpeakers().then((obs) =>
      obs.subscribe((speakers: any[]) => this.speakers = speakers));
  }

  constructor(private readonly repository: Repository) {
    window.addEventListener('themeChanged', () => this.load());
  }

  ionViewDidEnter() {
    this.load();
  }
}

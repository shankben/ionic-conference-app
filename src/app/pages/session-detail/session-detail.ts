import { Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import Repository from '../../repository';

@Component({
  selector: 'page-session-detail',
  styleUrls: ['./session-detail.scss'],
  templateUrl: 'session-detail.html'
})
export class SessionDetailPage {
  session: any;
  isFavorite = false;
  defaultHref = '';

  constructor(
    private repository: Repository,
    private route: ActivatedRoute
  ) { }

  ionViewWillEnter() {
    const sessionId = this.route.snapshot.paramMap.get('sessionId');
    this.repository.sessionById(sessionId).subscribe((it) => {
      this.session = Array.isArray(it) ? it.shift() : it;
      this.isFavorite = this.repository.hasFavorite(this.session.name);
    });
  }

  ionViewDidEnter() {
    this.defaultHref = `/app/tabs/schedule`;
  }

  sessionClick(item: string) {
    console.log('Clicked', item);
  }

  toggleFavorite() {
    if (this.repository.hasFavorite(this.session.name)) {
      this.repository.removeFavorite(this.session.name);
      this.isFavorite = false;
    } else {
      this.repository.addFavorite(this.session.name);
      this.isFavorite = true;
    }
  }

  shareSession() {
    console.log('Clicked share session');
  }
}

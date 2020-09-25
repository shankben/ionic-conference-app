import { ToastController } from '@ionic/angular';
import { Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import Repository from '../../repository';
import { Session } from '../../models';

@Component({
  selector: 'page-session-detail',
  styleUrls: ['./session-detail.scss'],
  templateUrl: 'session-detail.html'
})
export class SessionDetailPage {
  session: Session;
  isFavorite = false;
  isLiked = false;
  defaultHref = '';

  constructor(
    private repository: Repository,
    private route: ActivatedRoute,
    private toastCtrl: ToastController
  ) { }

  async ionViewWillEnter() {
    const user = await this.repository.user();
    const sessionId = this.route.snapshot.paramMap.get('sessionId');
    (await this.repository.sessionById(sessionId)).subscribe((it) => {
      this.session = it;
      this.isLiked = new Set(this.session.likes ?? []).has(user.username);
      this.repository.hasFavorite(this.session.name)
        .then((val) => this.isFavorite = val);
    });
  }

  ionViewDidEnter() {
    this.defaultHref = `/app/tabs/schedule`;
  }

  sessionClick(item: string) {
    console.log('Clicked', item);
  }

  async toggleLike() {
    try {
      await this.repository.toggleLikeSession(this.session.id);
      (await this.toastCtrl.create({
        message: `${!this.isLiked ? 'Unl' : 'L'}iked ${this.session.name}!`,
        duration: 3000
      })).present();
    } catch (err) {
      (await this.toastCtrl.create({
        message: 'Sign in to like sessions!',
        duration: 3000
      })).present();
    }
  }

  async toggleFavorite() {
    const hasFavorite = await this.repository.hasFavorite(this.session.name);
    this.isFavorite = !hasFavorite;
    if (hasFavorite) {
      await this.repository.removeFavorite(this.session.name);
    } else {
      await this.repository.addFavorite(this.session.name);
    }
  }

  shareSession() {
    console.log('Clicked share session');
  }
}

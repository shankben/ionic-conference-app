import { Component, Inject, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { LoadingController } from '@ionic/angular';

import Repository from '../../repository';
import { UserOptions } from '../../models';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
  styleUrls: ['./signin.scss'],
})
export class SignInPage implements AfterViewInit {
  userOptions: UserOptions = {
    username: '',
    email: '',
    password: ''
  };

  usernameLabel = 'Username';

  submitted = false;

  private loading: HTMLIonLoadingElement;

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    public repository: Repository,
    public router: Router,
    public loadingController: LoadingController
  ) {
    window.addEventListener('user:signin', () => {
      this.router.navigateByUrl('/app/tabs/schedule');
    });
  }

  private async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Signing you in...'
    });
    await this.loading.present();
  }

  async onSignIn(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      await this.presentLoading();
      await this.repository.signIn(this.userOptions);
      await this.loading.dismiss();
      this.submitted = false;
    }
  }

  async ngAfterViewInit() {
    const appEl = this.doc.querySelector('ion-app');
    const isDark = appEl.classList.contains('dark-theme');
    this.usernameLabel = !isDark ? 'Username' : 'Email';

    const observer = new MutationObserver((mutations) => {
      mutations.forEach(async (mutation) => {
        if (mutation.attributeName !== 'class') {
          return;
        }
        const el = mutation.target as HTMLElement;
        this.usernameLabel = !el.classList.contains('dark-theme') ?
          'Username' :
          'Email';
      });
    });

    observer.observe(appEl, {
      attributes: true
    });
  }

  onSignUp() {
    this.router.navigateByUrl('/signup');
  }
}

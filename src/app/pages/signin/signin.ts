import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import Repository from '../../repository';
import { UserOptions } from '../../models';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
  styleUrls: ['./signin.scss'],
})
export class SignInPage {
  userOptions: UserOptions = {
    username: '',
    email: '',
    password: ''
  };

  submitted = false;

  private loading: HTMLIonLoadingElement;

  constructor(
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

  onSignUp() {
    this.router.navigateByUrl('/signup');
  }
}

import { AlertController } from '@ionic/angular';

import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';


@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  styleUrls: ['./account.scss'],
})
export class AccountPage {
  user: any;

  constructor(
    public alertCtrl: AlertController,
    public router: Router,
    public userData: UserData
  ) {
    this.user = this.userData.user;
    window.addEventListener('user:login', () => this.user = this.userData.user);
  }

  updatePicture() {
    console.log('Clicked to update picture');
  }

  async changeUsername() {
    const alert = await this.alertCtrl.create({
      header: 'Change Username',
      buttons: [
        'Cancel',
        {
          text: 'OK',
          handler: ({ username }: any) => {
            this.userData
              .updateUser({ displayName: username })
              .catch(console.error);
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          name: 'username',
          value: this.userData.user.email,
          placeholder: 'username'
        }
      ]
    });
    await alert.present();
  }

  changePassword() {
    console.log('Clicked to change password');
  }

  logout() {
    this.userData.logout();
    this.router.navigateByUrl('/login');
  }
}

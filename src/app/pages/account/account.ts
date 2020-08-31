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
    this.userData.user().then((user) => this.user = user);
    window.addEventListener('user:signin', () => {
      this.userData.user().then((user) => this.user = user);
    });
  }

  async profilePictureChange(ev: Event) {
    const fileInput = ev.target as HTMLInputElement;
    const file = Array.from(fileInput.files).pop();
    await this.userData.updateUser({ profilePicture: file });
  }

  async changeUsername() {
    const alert = await this.alertCtrl.create({
      header: 'Change Username',
      buttons: [
        'Cancel',
        {
          text: 'OK',
          handler: ({ username }: any) => this.userData
            .updateUser({ displayName: username })
            .catch(console.error)
        }
      ],
      inputs: [
        {
          type: 'text',
          name: 'username',
          value: this.user.email,
          placeholder: 'username'
        }
      ]
    });
    await alert.present();
  }

  changePassword() {
    console.log('Clicked to change password');
  }

  signOut() {
    this.userData.signOut();
    this.router.navigateByUrl('/signin');
  }
}

import { AlertController } from '@ionic/angular';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Repository from '../../repository';
import { User } from '../../models';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  styleUrls: ['./account.scss'],
})
export class AccountPage {
  user: User;

  private setUser() {
    this.repository.user().then((user) => this.user = user);
  }

  constructor(
    public alertCtrl: AlertController,
    public router: Router,
    public repository: Repository
  ) {
    this.setUser();
    window.addEventListener('user:signin', () => this.setUser());
    window.addEventListener('themeChanged', () => this.setUser());
  }

  async profilePictureChange(ev: Event) {
    const fileInput = ev.target as HTMLInputElement;
    const file = Array.from(fileInput.files).pop();
    await this.repository.updateUser({ profilePicture: file });
    this.user = await this.repository.user();
  }

  async changeUsername() {
    const alert = await this.alertCtrl.create({
      header: 'Change Username',
      buttons: [
        'Cancel',
        {
          text: 'OK',
          handler: ({ username }: any) => this.repository
            .updateUser({ displayName: username })
            .then(() => this.repository.user().then((user) => this.user = user))
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
    this.repository.signOut();
    this.router.navigateByUrl('/signin');
  }
}

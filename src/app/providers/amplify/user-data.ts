import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import Amplify, { Auth } from 'aws-amplify';

import { UserOptions, UserUpdate } from '../../interfaces/user-options';


@Injectable({ providedIn: 'root' })
export class AmplifyUserData {
  get user(): any {
    return null;
  }

  constructor(public storage: Storage) {
    Amplify.configure({
      Auth: {
        identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',
        region: 'XX-XXXX-X',
        identityPoolRegion: 'XX-XXXX-X',
        userPoolId: 'XX-XXXX-X_abcd1234',
        userPoolWebClientId: 'a1b2c3d4e5f6g7h8i9j0k1l2m3'
      }
    });
  }

  async updateUser(userOptions: UserUpdate) { }

  async login(userOptions: UserOptions): Promise<any> {
    const { email, password } = userOptions;
    try {
      // call signIn
      return window.dispatchEvent(new CustomEvent('user:login'));
    } catch (err) {
      console.error(err);
    }
  }

  async logout(): Promise<any> {

  }

  async signup(userOptions: UserOptions): Promise<any> {

  }

  async isLoggedIn(): Promise<boolean> {
    return false;
  }

  async checkHasSeenTutorial(): Promise<string> {
    return '';
  }
}

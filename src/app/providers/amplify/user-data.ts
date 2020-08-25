import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import Amplify, { Auth } from 'aws-amplify';

import { UserOptions, UserUpdate } from '../../interfaces/user-options';


@Injectable({ providedIn: 'root' })
export class AmplifyUserData {
  get user(): any {
    return Auth.currentAuthenticatedUser();
  }

  constructor(public storage: Storage) {
    Amplify.configure({
      Auth: {
        region: 'us-east-1',
        identityPoolId: 'us-east-1:43df0876-52de-46b8-bbb0-0209445e5779',
        identityPoolRegion: 'us-east-1',
        userPoolId: 'us-east-1_ozNoY9c4M',
        userPoolWebClientId: 'tlh2ffuk2tqmjackppd2oh2gs',
        authenticationFlowType: 'USER_PASSWORD_AUTH'
      }
    });
  }

  async updateUser(userOptions: UserUpdate) { }

  async login(userOptions: UserOptions): Promise<any> {
    const { email, password } = userOptions;
    try {
      await Auth.signIn(email, password);
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

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import Amplify, { Auth } from 'aws-amplify';

import { UserOptions, UserUpdate } from '../../interfaces/user-options';

import { APIService } from './API.service';


@Injectable({ providedIn: 'root' })
export class AmplifyUserData {
  get user(): any {
    return Auth.currentAuthenticatedUser();
  }

  constructor(
    public storage: Storage,
    public appSyncService: APIService
  ) {
    Amplify.configure({
      aws_appsync_graphqlEndpoint: 'https://v5x3hir3ujcjjmh2leisksak2e.appsync-api.us-east-1.amazonaws.com/graphql',
      aws_appsync_region: 'us-east-1',
      aws_appsync_authenticationType: 'API_KEY',
      aws_appsync_apiKey: 'da2-7ozmt6j2rbeixjs3jn2zb424wm',
      Auth: {
        region: 'us-east-1',
        identityPoolRegion: 'us-east-1',
        identityPoolId: 'us-east-1:94a40cc3-ddaa-48ab-8ac9-5f60681dd605',
        userPoolId: 'us-east-1_EtmbYJhyA',
        userPoolWebClientId: '52nl2q4lc126hgqfiekb67vh8d',
        authenticationFlowType: 'USER_PASSWORD_AUTH'
      }
    });
  }

  async updateUser(userOptions: UserUpdate) {
  }

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

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import Amplify, { Auth } from 'aws-amplify';
import { UserOptions, UserUpdate } from '../../interfaces/user-options';
import { User } from '../../interfaces/user';

@Injectable({ providedIn: 'root' })
export class AmplifyUserData {
  constructor(public storage: Storage) {
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

  async user(): Promise<User> {
    const user = await Auth.currentAuthenticatedUser();
    return {
      username: user.username,
      email: user.attributes.email,
      picture: user.attributes.picture || 'http://www.gravatar.com/avatar'
    };
  }

  async updateUser(userOptions: UserUpdate) { }

  async signIn(userOptions: UserOptions): Promise<any> {
    const { email, password } = userOptions;
    try {
      await Auth.signIn(email, password);
      return window.dispatchEvent(new CustomEvent('user:signin'));
    } catch (err) {
      console.error(err);
    }
  }

  async confirmSignup(username: string, code: string): Promise<any> {
    try {
      await Auth.confirmSignUp(username, code);
    } catch (err) {
      console.error(err);
    }
  }

  async signup(userOptions: UserOptions): Promise<any> {
    const { username, email, password } = userOptions;
    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          email
        }
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async signOut(): Promise<any> {
    if (Auth.currentAuthenticatedUser()) {
      await Auth.signOut();
    }
    window.dispatchEvent(new CustomEvent('user:signout'));
  }

  async isSignedIn(): Promise<boolean> {
    return Boolean(await Auth.currentAuthenticatedUser());
  }

  async checkHasSeenTutorial(): Promise<string> {
    return '';
  }
}

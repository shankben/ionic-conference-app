import { Injectable } from '@angular/core';
import { Storage as IonicStorage } from '@ionic/storage';
import Amplify, { Auth, Storage } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';
import { UserOptions, UserUpdate } from '../../interfaces/user-options';
import { User } from '../../interfaces/user';

@Injectable({ providedIn: 'root' })
export class AmplifyUserData {
  constructor(public storage: IonicStorage) {
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
      },
      Storage: {
        AWSS3: {
          bucket: 'ionic-conference-demo',
          region: 'us-east-1'
        }
      }
    });
  }

  async user(): Promise<User> {
    const user = await Auth.currentAuthenticatedUser();
    const photoURL = await Storage.get(user.attributes.picture) as string;
    return {
      username: user.attributes.preferred_username || user.username,
      email: user.attributes.email,
      picture: photoURL || 'http://www.gravatar.com/avatar'
    };
  }

  async updateUser(userOptions: UserUpdate) {
    const user: CognitoUser = await Auth.currentAuthenticatedUser();
    const attributes = await Auth.userAttributes(user);
    const sub = attributes.find((it: any) => it.Name === 'sub').getValue();
    if (!user) {
      return;
    }
    const { displayName, profilePicture } = userOptions;
    if (displayName) {
      await Auth.updateUserAttributes(user, {
        preferred_username: displayName
      });
    }
    if (profilePicture) {
      try {
        await Storage.put(`${sub}.jpg`, profilePicture, {
          contentType: 'image/jpeg'
        });
        await Auth.updateUserAttributes(user, {
          picture: `${sub}.jpg`
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

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
}

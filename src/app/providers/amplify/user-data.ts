import { Injectable } from '@angular/core';
import Amplify, { Auth, Storage } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';

import { UserOptions, UserUpdate } from '../../interfaces/user-options';
import { User } from '../../interfaces/user';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AmplifyUserData {
  constructor() {
    Amplify.configure(environment.amplify);
  }

  private async blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const fr = new FileReader();
        fr.onload = (e) => resolve(e.target.result as string);
        fr.readAsDataURL(blob);
      } catch (err) {
        reject(err);
      }
    });
  }

  async user(): Promise<User> {
    let pictureUrl: string;
    const user = await Auth.currentAuthenticatedUser();
    try {
      if (!user.attributes.picture) {
        throw new Error();
      }
      const { picture } = user.attributes;
      const res = await Storage.get(picture, { download: true }) as any;
      pictureUrl = await this.blobToDataUrl(res.Body);
    } catch (err) {
      pictureUrl = 'http://www.gravatar.com/avatar';
    }
    return {
      username: user.attributes.preferred_username || user.username,
      email: user.attributes.email,
      picture: pictureUrl
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

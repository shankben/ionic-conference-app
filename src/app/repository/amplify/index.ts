import { Injectable } from '@angular/core';
import Amplify, { Auth, Storage } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';
import {
  OperatorFunction,
  Observer,
  Observable,
  from,
  merge
} from 'rxjs';

import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
Amplify.configure(environment.amplify);

import {
  KeyIdLike,
  Location,
  NameLike,
  Session,
  Speaker,
  Track,
  Unsubscribable,
  User,
  UserOptions,
  UserUpdate
} from '../../models';

import { APIService } from './API.service';

@Injectable({ providedIn: 'root' })
export default class AmplifyStrategy {

  private locationsSubscription: Unsubscribable;

  private oneKeyToId<T>(item: KeyIdLike): T {
    item.id = item.key;
    return (item as unknown) as T;
  }

  private keysToIds<T>(): OperatorFunction<KeyIdLike[], T[]> {
    return map((items: KeyIdLike[]) =>
      items.map((it: KeyIdLike) =>
        this.oneKeyToId<T>(it)));
  }

  private keyToId<T>(): OperatorFunction<KeyIdLike, T> {
    return map((item: KeyIdLike) => this.oneKeyToId(item));
  }

  private sortByName<T>(): OperatorFunction<NameLike[], T[]> {
    return map((items: NameLike[]) =>
      (items.sort((x, y) => x.name <= y.name ? -1 : 1) as unknown[]) as T[]);
  }

  private async blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const fr = new FileReader();
        fr.onload = (ev) => resolve(ev.target.result as string);
        fr.readAsDataURL(blob);
      } catch (err) {
        reject(err);
      }
    });
  }

  constructor(private readonly appSyncService: APIService) {
    window.addEventListener('themeChanged', (ev: CustomEvent) => {
      if (ev.detail.isDark && this.locationsSubscription) {
        this.locationsSubscription.unsubscribe();
      }
    });
  }


  //// User
  async user(): Promise<User> {
    try {
      const user = await Auth.currentAuthenticatedUser();
      if (!user.attributes.picture) {
        throw new Error();
      }
      const { picture } = user.attributes;
      const res = await Storage.get(picture, { download: true }) as any;
      const pictureUrl = await this.blobToDataUrl(res.Body);
      return {
        username: user.attributes.preferred_username || user.username,
        email: user.attributes.email,
        picture: pictureUrl
      };
    } catch (err) {
      return {
        username: 'anonymous',
        email: 'anonymous',
        picture: 'http://www.gravatar.com/avatar'
      };
    }
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

  async signIn(userOptions: UserOptions): Promise<boolean> {
    const { email, password } = userOptions;
    try {
      await Auth.signIn(email, password);
      return window.dispatchEvent(new CustomEvent('user:signin'));
    } catch (err) {
      console.error(err);
    }
  }

  async signOut() {
    if (Auth.currentAuthenticatedUser()) {
      await Auth.signOut();
    }
    window.dispatchEvent(new CustomEvent('user:signout'));
  }

  async confirmSignup(username: string, code: string) {
    try {
      await Auth.confirmSignUp(username, code);
    } catch (err) {
      console.error(err);
    }
  }

  async signUp(userOptions: UserOptions) {
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

  async isSignedIn(): Promise<boolean> {
    try {
      return Boolean(await Auth.currentAuthenticatedUser());
    } catch (err) {
      return false;
    }
  }


  //// Sessions
  sessionById(sessionId: string): Observable<Session> {
    return from(this.appSyncService.GetSession(sessionId)).pipe(this.keyToId());
  }

  listSessions(): Observable<Session[]> {
    return from(this.appSyncService.ListSessions()).pipe(this.keysToIds());
  }


  //// Speakers
  speakerById(speakerId: string): Observable<Speaker> {
    return from(this.appSyncService.GetSpeaker(speakerId)).pipe(this.keyToId());
  }

  listSpeakers(): Observable<Speaker[]> {
    return from(this.appSyncService.ListSpeakers())
      .pipe(this.keysToIds())
      .pipe(this.sortByName());
  }


  //// Tracks
  listTracks(): Observable<Track[]> {
    return from(this.appSyncService.ListTracks());
  }


  //// Locations
  listLocations(): Observable<Location[]> {
    try {
      this.locationsSubscription.unsubscribe();
    } catch (err) {
      // OK: Always unconditionally unsubscribe
    }
    const obs = Observable
      .create((observer: Observer<Location[]>) => {
        this.locationsSubscription = this.appSyncService
          .UpdatedLocationListener
          .subscribe((res: any) => observer
            .next([res.value.data.updatedLocation as Location]));
      });
    const ls = from(this.appSyncService.ListLocations());
    return merge(ls, obs);
  }
}

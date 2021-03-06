import { Injectable } from '@angular/core';
import { Observable, from, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import Amplify, { Auth, Storage } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';
import * as mutations from './graphql/mutations';
import * as queries from './graphql/queries';
import * as subscriptions from './graphql/subscriptions';
import { environment } from '../../../environments/environment';
import * as utils from './utils';
import { performGraphqlOperation, subscribe } from './utils';

import {
  Location,
  Session,
  Speaker,
  Track,
  Unsubscribable,
  User,
  UserOptions,
  UserUpdate
} from '../../models';

Amplify.configure(environment.amplify);


@Injectable({ providedIn: 'root' })
export default class AmplifyStrategy {
  private subscriptions: {[k: string]: Unsubscribable} = {};

  private unsubscribe(subscription: Unsubscribable) {
    try {
      subscription.unsubscribe();
    } catch (err) {
      // OK: Always unconditionally unsubscribe
    }
  }

  constructor() {
    window.addEventListener('themeChanged', (ev: CustomEvent) => {
      if (ev.detail.isDark) {
        Object.values(this.subscriptions).forEach((it) => this.unsubscribe(it));
      }
    });
  }

  //// User
  async user(): Promise<User> {
    try {
      const user = await Auth.currentAuthenticatedUser();
      let picture = 'http://www.gravatar.com/avatar';
      if (user.attributes.picture) {
        picture = user.attributes.picture;
        const res = await Storage.get(picture, { download: true }) as any;
        picture = await utils.blobToDataUrl(res.Body);
      }
      return {
        username: user.attributes.preferred_username || user.username,
        email: user.attributes.email,
        picture
      };
    } catch (err) {
      return {
        isAnonymous: true,
        email: 'anonymous',
        username: 'anonymous',
        picture: 'http://www.gravatar.com/avatar'
      };
    }
  }

  async isSignedIn(): Promise<boolean> {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return Boolean(user) && !user.isAnonymous;
    } catch (err) {
      return false;
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
      throw err;
    }
  }

  async signOut() {
    try {
      await Auth.signOut();
      window.dispatchEvent(new CustomEvent('user:signout'));
    } catch (err) {
      // OK: Sign out unconditionally
    }
  }

  async confirmSignup(username: string, code: string) {
    try {
      await Auth.confirmSignUp(username, code);
    } catch (err) {
      throw err;
    }
  }

  //// Sessions
  async toggleLikeSession(sessionId: string) {
    const user = await this.user();
    if (user.isAnonymous) {
      throw new Error('Not signed in');
    }
    const session = await performGraphqlOperation<Session>(
      queries.getSession,
      { key: sessionId }
    );
    const likes = new Set(session.likes ?? []);
    if (!likes.has(user.username)) {
      likes.add(user.username);
    } else {
      likes.delete(user.username);
    }
    try {
      await performGraphqlOperation<Session>(
        mutations.updateSession,
        {input: {
          key: sessionId,
          likes: Array.from(likes)
        }}
      );
    } catch (err) {
      console.error(err);
    }
  }

  sessionById(sessionId: string): Observable<Session> {
    this.unsubscribe(this.subscriptions.sessionById);
    const res = subscribe<Session>(subscriptions.updatedSession);
    this.subscriptions.sessionById = res.subscription;
    return merge(
      from(performGraphqlOperation(queries.getSession, { key: sessionId })),
      res.observable
    ).pipe(utils.keyToId());
  }

  listSessions(): Observable<Session[]> {
    return from(performGraphqlOperation<Session[]>(queries.listSessions))
      .pipe(utils.keysToIds());
  }

  //// Speakers
  speakerById(speakerId: string): Observable<Speaker> {
    const args = { key: speakerId };
    return from(performGraphqlOperation<Speaker>(queries.getSpeaker, args))
      .pipe(utils.keyToId());
  }

  listSpeakers(): Observable<Speaker[]> {
    return from(performGraphqlOperation<Speaker[]>(queries.listSpeakers))
      .pipe(utils.keysToIds())
      .pipe(utils.sortByName());
  }

  //// Tracks
  listTracks(): Observable<Track[]> {
    return from(performGraphqlOperation<Track[]>(queries.listTracks));
  }

  //// Locations
  listLocations(): Observable<Location[]> {
    this.unsubscribe(this.subscriptions.listLocations);
    const res = subscribe<Location>(subscriptions.updatedLocation);
    this.subscriptions.listLocations = res.subscription;
    return merge(
      from(performGraphqlOperation<Location[]>(queries.listLocations)),
      res.observable.pipe(map((it) => [it]))
    );
  }
}

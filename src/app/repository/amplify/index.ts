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

import {
  UpdatedLocationSubscription
} from './API.service';

Amplify.configure(environment.amplify);


@Injectable({ providedIn: 'root' })
export default class AmplifyStrategy {

  private subscriptions: {[k: string]: Unsubscribable} = {};

  constructor() {
    window.addEventListener('themeChanged', (ev: CustomEvent) => {
      if (ev.detail.isDark) {
        Object.values(this.subscriptions).forEach((it) => it.unsubscribe());
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
      const pictureUrl = await utils.blobToDataUrl(res.Body);
      return {
        username: user.attributes.preferred_username || user.username,
        email: user.attributes.email,
        picture: pictureUrl
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

  async isSignedIn(): Promise<boolean> {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return Boolean(user) && !user.isAnonymous;
    } catch (err) {
      return false;
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
    try {
      await Auth.signOut();
      window.dispatchEvent(new CustomEvent('user:signout'));
    } catch (err) {
      // OK: Sign out unconditionally
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
    const session = await utils.performGraphqlOperation<Session>(
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
      await utils.performGraphqlOperation<Session>(
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
    try {
      this.subscriptions.sessionById.unsubscribe();
    } catch (err) {
      // OK: Always unconditionally unsubscribe
    }
    const { observable, subscription } = utils.subscribe<Session>(
      subscriptions.updatedSession
    );
    this.subscriptions.sessionById = subscription;
    return merge(
      from(utils.performGraphqlOperation<Session>(queries.getSession, {
        key: sessionId
      })),
      observable
    ).pipe(utils.keyToId<Session>());
  }

  listSessions(): Observable<Session[]> {
    return from(utils.performGraphqlOperation<Session[]>(queries.listSessions))
      .pipe(utils.keysToIds());
  }


  //// Speakers
  speakerById(speakerId: string): Observable<Speaker> {
    return from(utils.performGraphqlOperation<Speaker>(queries.getSpeaker, {
      key: speakerId
    })).pipe(utils.keyToId());
  }

  listSpeakers(): Observable<Speaker[]> {
    return from(utils.performGraphqlOperation<Speaker[]>(queries.listSpeakers))
      .pipe(utils.keysToIds())
      .pipe(utils.sortByName());
  }


  //// Tracks
  listTracks(): Observable<Track[]> {
    return from(utils.performGraphqlOperation<Track[]>(queries.listTracks));
  }

  //// Locations
  listLocations(): Observable<Location[]> {
    try {
      this.subscriptions.listLocations.unsubscribe();
    } catch (err) {
      // OK: Always unconditionally unsubscribe
    }
    const { observable, subscription } = utils.subscribe<Location>(
      subscriptions.updatedLocation
    );
    this.subscriptions.listLocations = subscription;
    return merge(
      from(utils.performGraphqlOperation<Location[]>(queries.listLocations)),
      observable.pipe(map((it) => [it]))
    );
  }
}

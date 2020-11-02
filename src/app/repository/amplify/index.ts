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
    // Implement me!
  }

  async isSignedIn(): Promise<boolean> {
    // Implement me!
  }

  async updateUser(userOptions: UserUpdate) {
    // Implement me!
  }

  async signIn(userOptions: UserOptions) {
    // Implement me!
  }

  async signUp(userOptions: UserOptions) {
    // Implement me!
  }

  async signOut() {
    // Implement me!
  }

  async confirmSignup(username: string, code: string) {
    // Implement me!
  }

  //// Sessions
  async toggleLikeSession(sessionId: string) {
    // Implement me!
  }

  sessionById(sessionId: string): Observable<Session> {
    // Implement me!
  }

  listSessions(): Observable<Session[]> {
    // Implement me!
  }

  //// Speakers
  speakerById(speakerId: string): Observable<Speaker> {
    // Implement me!
  }

  listSpeakers(): Observable<Speaker[]> {
    // Implement me!
  }

  //// Tracks
  listTracks(): Observable<Track[]> {
    // Implement me!
  }

  //// Locations
  listLocations(): Observable<Location[]> {
    // Implement me!
  }
}

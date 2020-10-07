import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import AmplifyStrategy from './amplify';
import FirebaseStrategy from './firebase';
import {
  Location,
  Session,
  SessionGroup,
  SessionGroupItem,
  Speaker,
  Track,
  User,
  UserOptions,
  UserUpdate
} from '../models';

@Injectable({ providedIn: 'root' })
export default class Repository {
  private strategy: AmplifyStrategy | FirebaseStrategy;

  private favorites: Set<string> = new Set();

  private filterSession(
    session: any,
    queryWords: string[],
    excludeTracks: string[],
    segment: string
  ) {
    let matchesQueryText = false;
    if (queryWords.length) {
      queryWords.forEach((it: string) => {
        if (session.name.toLowerCase().indexOf(it) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      matchesQueryText = true;
    }

    let matchesTracks = false;
    session.tracks.forEach((trackName: string) => {
      if (excludeTracks.indexOf(trackName) === -1) {
        matchesTracks = true;
      }
    });

    let matchesSegment = false;

    if (segment === 'favorites') {
      if (this.favorites.has(session.name)) {
        matchesSegment = true;
      }
    } else {
      matchesSegment = true;
    }

    session.hide = !(matchesQueryText && matchesTracks && matchesSegment);
  }

  private groupSessions(
    sessions: Session[],
    queryText = '',
    excludeTracks: string[] = [],
    segment = 'all'
  ): SessionGroup {
    const queryWords = queryText
      .toLowerCase()
      .replace(/,|\.|-/g, ' ')
      .split(' ')
      .filter((it) => !!it.trim().length);
    const groups = new Map<string, SessionGroupItem>();
    let shownSessions = 0;
    sessions
      .sort((x, y) => x.groupId <= y.groupId ? -1 : 1)
      .forEach((session) => {
        this.filterSession(session, queryWords, excludeTracks, segment);
        if (!groups.has(session.groupId)) {
          groups.set(session.groupId, {
            hide: true,
            sessions: []
          });
        }
        const group = groups.get(session.groupId);
        if (!('time' in group) || group.time > session.timeStart) {
          group.time = session.timeStart;
        }
        group.sessions.push(session);
        if (!session.hide) {
          group.hide = false;
          ++shownSessions;
        }
      });

    return {
      shownSessions,
      groups: Array.from(groups.values()).map((group) => ({
        ...group,
        sessions: group.sessions
          .sort((x, y) => x.timeStart <= y.timeStart ? -1 : 1)
      }))
    };
  }

  constructor(
    amplifyStrategy: AmplifyStrategy,
    firebaseStrategy: FirebaseStrategy
  ) {
    this.strategy = environment.provider === 'firebase' ?
      firebaseStrategy :
      amplifyStrategy;
    window.addEventListener('themeChanged', (ev: CustomEvent) => {
      this.strategy = !ev.detail.isDark ?
        amplifyStrategy :
        firebaseStrategy;
    });
  }

  //// User
  async user(): Promise<User> {
    return await this.strategy.user();
  }

  async isSignedIn(): Promise<boolean> {
    return await this.strategy.isSignedIn();
  }

  async updateUser(userOptions: UserUpdate) {
    return this.strategy.updateUser(userOptions);
  }

  async signIn(userOptions: UserOptions) {
    return this.strategy.signIn(userOptions);
  }

  async signUp(userOptions: UserOptions) {
    return this.strategy.signUp(userOptions);
  }

  async signOut() {
    return this.strategy.signOut();
  }

  async confirmSignup(username: string, code: string) {
    return this.strategy.confirmSignup(username, code);
  }


  //// Favorites
  async hasFavorite(sessionName: string): Promise<boolean> {
    return this.favorites.has(sessionName);
  }

  async addFavorite(sessionName: string): Promise<void> {
    this.favorites.add(sessionName);
  }

  async removeFavorite(sessionName: string): Promise<void> {
    this.favorites.delete(sessionName);
  }

  //// Sessions
  async toggleLikeSession(sessionId: string) {
    return this.strategy.toggleLikeSession(sessionId);
  }

  async sessionById(sessionId: string): Promise<Observable<Session>> {
    return this.strategy.sessionById(sessionId);
  }

  async listSessions(
    queryText = '',
    excludeTracks: string[] = [],
    segment = 'all'
  ): Promise<Observable<SessionGroup>> {
    return this.strategy.listSessions()
      .pipe(map((sessions) => this.groupSessions(
        sessions,
        queryText,
        excludeTracks,
        segment
      )
    ));
  }

  //// Speakers
  async speakerById(speakerId: string): Promise<Observable<Speaker>>  {
    return this.strategy.speakerById(speakerId);
  }

  async listSpeakers(): Promise<Observable<Speaker[]>> {
    return this.strategy.listSpeakers();
  }

  //// Tracks
  async listTracks(): Promise<Observable<Track[]>> {
    return this.strategy.listTracks();
  }

  //// Locations
  async listLocations(): Promise<Observable<Location[]>> {
    return this.strategy.listLocations();
  }
}

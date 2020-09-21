import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { UserOptions, UserUpdate } from '../interfaces/user-options';
import { User } from '../interfaces/user';
import { Session } from '../interfaces/session';

import AmplifyStrategy from './amplify';
import FirebaseStrategy from './firebase';


interface SessionGroupItem {
  time?: string;
  hide: boolean;
  sessions: Session[];
}

interface SessionGroup {
  shownSessions: number;
  groups: SessionGroupItem[];
}


@Injectable({ providedIn: 'root' })
export default class Repository {
  private strategy: AmplifyStrategy | FirebaseStrategy;

  private favorites: Set<string> = new Set();

  private filterSession(
    session: any,
    queryWords: string[],
    excludeTracks: any[],
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
      if (this.hasFavorite(session.name)) {
        matchesSegment = true;
      }
    } else {
      matchesSegment = true;
    }

    session.hide = !(matchesQueryText && matchesTracks && matchesSegment);
  }

  private groupSessions(
    sessions: Session[],
    dayIndex: number,
    queryText = '',
    excludeTracks: any[] = [],
    segment = 'all'
  ): SessionGroup {
    const queryWords = queryText.split(' ').filter((it) => !!it.trim().length);
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
    this.strategy = firebaseStrategy;
    window.addEventListener('themeChanged', (ev: CustomEvent) => {
      this.strategy = !ev.detail.isDark ? amplifyStrategy : firebaseStrategy;
    });
  }

  //// User
  async user(): Promise<User> {
    return await this.strategy.user();
  }

  async updateUser(userOptions: UserUpdate): Promise<any> {
    return this.strategy.updateUser(userOptions);
  }

  async signIn(userOptions: UserOptions): Promise<any> {
    return this.strategy.signIn(userOptions);
  }

  async signOut(): Promise<any> {
    return this.strategy.signOut();
  }

  async signUp(userOptions: UserOptions): Promise<any> {
    return this.strategy.signUp(userOptions);
  }

  async confirmSignup(username: string, code: string): Promise<any> {
    return this.strategy.confirmSignup(username, code);
  }

  async isSignedIn(): Promise<boolean> {
    return await this.strategy.isSignedIn();
  }

  //// Favorites
  hasFavorite(sessionName: string): boolean {
    return this.favorites.has(sessionName);
  }

  addFavorite(sessionName: string): void {
    this.favorites.add(sessionName);
  }

  removeFavorite(sessionName: string): void {
    this.favorites.delete(sessionName);
  }

  //// Sessions
  sessionById(sessionId: string): Observable<Session> {
    return this.strategy.sessionById(sessionId);
  }

  listSessions(
    dayIndex: number,
    queryText = '',
    excludeTracks: any[] = [],
    segment = 'all'
  ): Observable<SessionGroup> {
    return this.strategy.listSessions().pipe(map((sessions) =>
      this.groupSessions(
        sessions,
        dayIndex,
        queryText.toLowerCase().replace(/,|\.|-/g, ' '),
        excludeTracks,
        segment
      )));
  }

  //// Speakers
  speakerById(speakerId: string): Observable<any>  {
    return this.strategy.speakerById(speakerId);
  }

  listSpeakers(): Observable<any> {
    return this.strategy.listSpeakers();
  }

  //// Tracks
  listTracks(): Observable<any> {
    return this.strategy.listTracks();
  }

  //// Locations
  listLocations(): Observable<any> {
    return this.strategy.listLocations();
  }
}

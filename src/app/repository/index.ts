import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { UserOptions, UserUpdate } from '../interfaces/user-options';
import { User } from '../interfaces/user';
import { AmplifyUserData } from './amplify/user-data';
import { AmplifyConferenceData } from './amplify/conference-data';
import { FirebaseUserData } from './firebase/user-data';
import { FirebaseConferenceData } from './firebase/conference-data';


@Injectable({ providedIn: 'root' })
export default class Repository {
  private users: AmplifyUserData | FirebaseUserData;
  private sessions: AmplifyConferenceData | FirebaseConferenceData;
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
    sessions: any[],
    dayIndex: number,
    queryText = '',
    excludeTracks: any[] = [],
    segment = 'all'
  ): {[k: string]: any} {
    const queryWords = queryText.split(' ').filter((it) => !!it.trim().length);
    const groups = new Map();
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
    amplifyUsers: AmplifyUserData,
    amplifySessions: AmplifyConferenceData,
    firebaseUsers: FirebaseUserData,
    firebaseSessions: FirebaseConferenceData
  ) {
    this.users = firebaseUsers;
    this.sessions = firebaseSessions;
    window.addEventListener('themeChanged', (ev: CustomEvent) => {
      this.users = !ev.detail.isDark ? amplifyUsers : firebaseUsers;
      this.sessions = !ev.detail.isDark ? amplifySessions : firebaseSessions;
    });
  }

  //// User
  async user(): Promise<User> {
    return await this.users.user();
  }

  async updateUser(userOptions: UserUpdate): Promise<any> {
    return this.users.updateUser(userOptions);
  }

  async signIn(userOptions: UserOptions): Promise<any> {
    return this.users.signIn(userOptions);
  }

  async signOut(): Promise<any> {
    return this.users.signOut();
  }

  async signUp(userOptions: UserOptions): Promise<any> {
    return this.users.signUp(userOptions);
  }

  async confirmSignup(username: string, code: string): Promise<any> {
    return this.users.confirmSignup(username, code);
  }

  async isSignedIn(): Promise<boolean> {
    return await this.users.isSignedIn();
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
  sessionById(sessionId: string): Observable<any> {
    return this.sessions.sessionById(sessionId);
  }

  listSessions(
    dayIndex: number,
    queryText = '',
    excludeTracks: any[] = [],
    segment = 'all'
  ): Observable<any> {
    return this.sessions.listSessions().pipe(map((sessions) =>
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
    return this.sessions.speakerById(speakerId);
  }

  listSpeakers(): Observable<any> {
    return this.sessions.listSpeakers();
  }

  //// Tracks
  listTracks(): Observable<any> {
    return this.sessions.listTracks();
  }

  //// Locations
  listLocations(): Observable<any> {
    return this.sessions.listLocations();
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserData } from './user-data';
import { AmplifyConferenceData } from './amplify/conference-data';
import { FirebaseConferenceData } from './firebase/conference-data';

@Injectable({ providedIn: 'root' })
export class ConferenceData {
  private provider: AmplifyConferenceData | FirebaseConferenceData;

  data: any;

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
      if (this.userData.hasFavorite(session.name)) {
        matchesSegment = true;
      }
    } else {
      matchesSegment = true;
    }

    session.hide = !(matchesQueryText && matchesTracks && matchesSegment);
  }

  constructor(
    amplifyProvider: AmplifyConferenceData,
    firebaseProvider: FirebaseConferenceData,
    private readonly userData: UserData
  ) {
    this.provider = amplifyProvider;
    window.addEventListener(
      'themeChanged',
      (ev: CustomEvent) => this.provider = !ev.detail.isDark ?
        amplifyProvider :
        firebaseProvider
    );
  }

  getSessionById(sessionId: string): Observable<any> {
    return this.provider.getSessionById(sessionId);
  }

  getSessions(
    dayIndex: number,
    queryText = '',
    excludeTracks: any[] = [],
    segment = 'all'
  ): Observable<any> {
    queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    const queryWords = queryText.split(' ').filter((it) => !!it.trim().length);
    const groups = new Map();
    return this.provider.getSessions().pipe(map((sessions) => {
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
        groups: Array.from(groups.values()).map((group) => {
          group.sessions = group.sessions
            .sort((x, y) => x.timeStart <= y.timeStart ? -1 : 1);
          return group;
        })
      };
    }));
  }

  getSpeakerById(speakerId: string): Observable<any>  {
    return this.provider.getSpeakerById(speakerId);
  }

  getSpeakers(): Observable<any> {
    return this.provider.getSpeakers();
  }

  getTracks(): Observable<any> {
    return this.provider.getTracks();
  }

  getLocations(): Observable<any> {
    return this.provider.getLocations();
  }
}

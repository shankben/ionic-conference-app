import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserData } from '../user-data';
import { APIService, ListSessionsQuery } from './API.service';

interface Session extends ListSessionsQuery {
  hide?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AmplifyConferenceData {
  private filterSession(
    session: Session,
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
      if (this.user.hasFavorite(session.name)) {
        matchesSegment = true;
      }
    } else {
      matchesSegment = true;
    }

    session.hide = !(matchesQueryText && matchesTracks && matchesSegment);
  }

  constructor(
    public user: UserData,
    public appSyncService: APIService
  ) { }

  getSessionById(sessionId: string): Observable<any> {
    throw new Error(`Implement getSessionById(${sessionId})`);
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

    return from(this.appSyncService.ListSessions()).pipe(map((docs) => {
      let shownSessions = 0;
      docs
        .sort((x, y) => x.groupId <= y.groupId ? -1 : 1)
        .map((session: Session) => {
          this.filterSession(session, queryWords, excludeTracks, segment);
          if (!groups.has(session.groupId)) {
            groups.set(session.groupId, {
              hide: true,
              sessions: [] as Session[]
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

          return session;
        });

      return {
        shownSessions,
        groups: Array.from(groups.values())
      };
    }));
  }

  getSpeakerById(speakerId: string): Observable<any> {
    return of(...[{}]);
  }

  getSpeakers(): Observable<any> {
    return from(this.appSyncService.ListSpeakers());
  }

  getTracks(): Observable<any> {
    return from(this.appSyncService.ListTracks());
  }

  getLocations(): Observable<any> {
    return from(this.appSyncService.ListLocations());
  }
}

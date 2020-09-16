import { Injectable } from '@angular/core';
import { Observer, Observable, from, merge } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserData } from '../user-data';
import {
  APIService,
  ListLocationsQuery,
  ListSessionsQuery,
  ListSpeakersQuery,
  ListTracksQuery
} from './API.service';

interface Session extends ListSessionsQuery {
  hide?: boolean;
}

interface KeyIdLike {
  key: string;
  id: string;
}

@Injectable({ providedIn: 'root' })
export class AmplifyConferenceData {
  private mapKeyToId<T>(item: KeyIdLike): T {
    item.id = item.key;
    return (item as unknown) as T;
  }

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
    (session as any).tracks.forEach((trackName: string) => {
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
    return from(this.appSyncService.GetSession(sessionId))
      .pipe(map((it) => this.mapKeyToId(it)));
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
        .map((it) => this.mapKeyToId(it))
        .forEach((session: Session) => {
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

  getSpeakerById(speakerId: string): Observable<any> {
    return from(this.appSyncService.GetSpeaker(speakerId))
      .pipe(map((it) => this.mapKeyToId(it)));
  }

  getSpeakers(): Observable<ListSpeakersQuery[]> {
    return from(this.appSyncService.ListSpeakers()).pipe(map((docs) => docs
      .map((it: ListSpeakersQuery) => this.mapKeyToId(it))
      .sort((x: ListSpeakersQuery, y: ListSpeakersQuery) =>
        x.name <= y.name ? -1 : 1) as ListSpeakersQuery[]
    ));
  }

  getTracks(): Observable<ListTracksQuery[]> {
    return from(this.appSyncService.ListTracks());
  }

  getLocations(): Observable<ListLocationsQuery[]> {
    const ls = from(this.appSyncService.ListLocations());
    const sub = Observable.create((observer: Observer<any>) => {
      this.appSyncService.UpdatedLocationListener.subscribe((res: any) => {
        observer.next([res.value.data.updatedLocation]);
      });
    });
    return merge(ls, sub);
  }
}

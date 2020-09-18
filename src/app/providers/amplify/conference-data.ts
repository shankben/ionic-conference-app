import { Injectable } from '@angular/core';
import { Observer, Observable, from, merge } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  APIService,
  GetSessionQuery,
  GetSpeakerQuery,
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
  private keyToId<T>(item: KeyIdLike): T {
    item.id = item.key;
    return (item as unknown) as T;
  }

  constructor(private readonly appSyncService: APIService) { }

  getSessionById(sessionId: string): Observable<GetSessionQuery> {
    return from(this.appSyncService.GetSession(sessionId))
      .pipe(map((it) => this.keyToId(it)));
  }

  getSessions(): Observable<ListSessionsQuery[]> {
    return from(this.appSyncService.ListSessions());
  }

  getSpeakerById(speakerId: string): Observable<GetSpeakerQuery> {
    return from(this.appSyncService.GetSpeaker(speakerId))
      .pipe(map((it) => this.keyToId(it)));
  }

  getSpeakers(): Observable<ListSpeakersQuery[]> {
    return from(this.appSyncService.ListSpeakers()).pipe(map((docs) => docs
      .map((it: ListSpeakersQuery) => this.keyToId(it))
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

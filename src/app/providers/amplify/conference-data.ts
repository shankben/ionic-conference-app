import { Injectable } from '@angular/core';
import {
  OperatorFunction,
  Observer,
  Observable,
  from,
  merge
} from 'rxjs';

import { map } from 'rxjs/operators';

import {
  APIService,
  GetSessionQuery,
  GetSpeakerQuery,
  ListLocationsQuery,
  ListSessionsQuery,
  ListSpeakersQuery,
  ListTracksQuery,
  UpdatedLocationSubscription
} from './API.service';

interface Session extends ListSessionsQuery {
  hide?: boolean;
}

interface KeyIdLike {
  key: string;
  id: string;
}

interface NameLike {
  name: string;
}

interface ZenSubscription {
  unsubscribe(): void;
}


@Injectable({ providedIn: 'root' })
export class AmplifyConferenceData {

  private sub: ZenSubscription;

  private oneKeyToId<T>(item: KeyIdLike): T {
    item.id = item.key;
    return (item as unknown) as T;
  }

  private keysToIds<T>(): OperatorFunction<KeyIdLike[], T[]> {
    return map((items: KeyIdLike[]) =>
      items.map((it: KeyIdLike) =>
        this.oneKeyToId<T>(it)));
  }

  private keyToId<T>(): OperatorFunction<KeyIdLike, T> {
    return map((item: KeyIdLike) => this.oneKeyToId(item));
  }

  private sortByName<T>(): OperatorFunction<NameLike[], T[]> {
    return map((items: NameLike[]) =>
      (items.sort((x, y) => x.name <= y.name ? -1 : 1) as unknown[]) as T[]);
  }

  constructor(private readonly appSyncService: APIService) {
    window.addEventListener('themeChanged', (ev: CustomEvent) => {
      if (ev.detail.isDark && this.sub) {
        this.sub.unsubscribe();
      }
    });
  }

  getSessionById(sessionId: string): Observable<GetSessionQuery> {
    return from(this.appSyncService.GetSession(sessionId))
      .pipe(this.keyToId());
  }

  getSessions(): Observable<ListSessionsQuery[]> {
    return from(this.appSyncService.ListSessions())
      .pipe(this.keysToIds());
  }

  getSpeakerById(speakerId: string): Observable<GetSpeakerQuery> {
    return from(this.appSyncService.GetSpeaker(speakerId))
      .pipe(this.keyToId());
  }

  getSpeakers(): Observable<ListSpeakersQuery[]> {
    return from(this.appSyncService.ListSpeakers())
      .pipe(this.keysToIds())
      .pipe(this.sortByName());
  }

  getTracks(): Observable<ListTracksQuery[]> {
    return from(this.appSyncService.ListTracks());
  }

  getLocations(): Observable<ListLocationsQuery[]> {
    try {
      this.sub.unsubscribe();
    } catch (err) {
      // OK: Always unconditionally unsubscribe
    }
    const obs = Observable
      .create((observer: Observer<UpdatedLocationSubscription[]>) => {
        this.sub = this.appSyncService.UpdatedLocationListener
          .subscribe((res: any) => observer
            .next([res.value.data.updatedLocation])) as ZenSubscription;
      });
    const ls = from(this.appSyncService.ListLocations());
    return merge(ls, obs);
  }
}

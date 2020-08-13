import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { of } from 'rxjs';
import { map, toArray } from 'rxjs/operators';

import { UserData } from './user-data';


interface Track {
  name: string;
  icon: string;
}


@Injectable({
  providedIn: 'root'
})
export class ConferenceData {
  data: any;

  constructor(
    public http: HttpClient,
    public user: UserData,
    public firestore: AngularFirestore
  ) { }

  getSessionById(sessionId: string) {
    return this.firestore
      .collection('sessions', (ref) => ref.limit(1)
        .where('id', '==', sessionId))
      .valueChanges();
  }

  getSessions(
    dayIndex: number,
    queryText = '',
    excludeTracks: any[] = [],
    segment = 'all'
  ) {
    queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    const queryWords = queryText.split(' ').filter((it) => !!it.trim().length);
    const groups = new Map();
    return this.firestore.collection('sessions').get().pipe(map(({ docs }) => {
      let shownSessions = 0;
      docs
        .map((it) => it.data())
        .sort((x, y) => x.groupId <= y.groupId ? -1 : 1)
        .map((session) => {
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
          return session;
        });

      return {
        shownSessions,
        groups: Array.from(groups.values())
      };
    }));
  }

  filterSession(
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
      if (this.user.hasFavorite(session.name)) {
        matchesSegment = true;
      }
    } else {
      matchesSegment = true;
    }

    session.hide = !(matchesQueryText && matchesTracks && matchesSegment);
  }

  getSpeakerById(speakerId: string) {
    return this.firestore
      .collection('speakers', (ref) => ref.limit(1)
        .where('id', '==', speakerId))
      .valueChanges();
  }

  getSpeakers() {
    return this.firestore
      .collection('speakers', (ref) => ref.orderBy('name'))
      .valueChanges();
  }

  getTracks() {
    return this.firestore.collection('tracks').valueChanges();
  }

  getLocations() {
    return this.firestore.collection('locations').valueChanges();
  }
}

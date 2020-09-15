import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserData } from '../user-data';

@Injectable({ providedIn: 'root' })
export class FirebaseConferenceData {
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
    private readonly afs: AngularFirestore
  ) { }

  getSessionById(sessionId: string): Observable<any> {
    return this.afs
      .collection('sessions', (ref) => ref.limit(1)
        .where('id', '==', sessionId))
      .valueChanges();
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
    return this.afs.collection('sessions').get().pipe(map(({ docs }) => {
      let shownSessions = 0;
      docs
        .map((it) => it.data())
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
          group.sessions = group.sessions.sort((x, y) => {
            return x.timeStart <= y.timeStart ? -1 : 1;
          });
          return group;
        })
      };
    }));
  }

  getSpeakerById(speakerId: string): Observable<any> {
    return this.afs
      .collection('speakers', (ref) => ref.limit(1)
        .where('id', '==', speakerId))
      .valueChanges();
  }

  getSpeakers(): Observable<any> {
    return this.afs
      .collection('speakers', (ref) => ref.orderBy('name'))
      .valueChanges();
  }

  getTracks(): Observable<any> {
    return this.afs.collection('tracks').valueChanges();
  }

  getLocations(): Observable<any> {
    return this.afs.collection('locations').valueChanges();
  }
}

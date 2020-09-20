import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FirebaseConferenceData {
  constructor(private readonly afs: AngularFirestore) { }

  sessionById(sessionId: string): Observable<any> {
    return this.afs
      .collection('sessions', (ref) => ref.limit(1)
        .where('id', '==', sessionId))
      .valueChanges();
  }

  listSessions(): Observable<any> {
    return this.afs.collection('sessions').get()
      .pipe(map(({ docs }) => docs.map((it) => it.data())));
  }

  speakerById(speakerId: string): Observable<any> {
    return this.afs
      .collection('speakers', (ref) => ref.limit(1)
        .where('id', '==', speakerId))
      .valueChanges();
  }

  listSpeakers(): Observable<any> {
    return this.afs
      .collection('speakers', (ref) => ref.orderBy('name'))
      .valueChanges();
  }

  listTracks(): Observable<any> {
    return this.afs.collection('tracks').valueChanges();
  }

  listLocations(): Observable<any> {
    return this.afs.collection('locations').valueChanges();
  }
}

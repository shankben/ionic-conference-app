import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { map } from 'rxjs/operators';

import { AmplifyUserData } from './user-data';

@Injectable({ providedIn: 'root' })
export class AmplifyConferenceData {
  data: any;

  constructor(
    public user: AmplifyUserData
  ) { }

  getSessionById(sessionId: string) {
  }

  getSessions(
    dayIndex: number,
    queryText = '',
    excludeTracks: any[] = [],
    segment = 'all'
  ) {
  }

  filterSession(
    session: any,
    queryWords: string[],
    excludeTracks: any[],
    segment: string
  ) {
  }

  getSpeakerById(speakerId: string) {
  }

  getSpeakers() {
  }

  getTracks() {
  }

  getLocations() {
  }
}

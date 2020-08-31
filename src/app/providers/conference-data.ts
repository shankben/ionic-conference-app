import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AmplifyConferenceData } from './amplify/conference-data';
import { FirebaseConferenceData } from './firebase/conference-data';

@Injectable({ providedIn: 'root' })
export class ConferenceData {
  private readonly provider: AmplifyConferenceData | FirebaseConferenceData;
  data: any;

  constructor(
    amplifyProvider: AmplifyConferenceData,
    firebaseProvider: FirebaseConferenceData
  ) {
    this.provider = environment.provider === 'firebase' ?
      firebaseProvider :
      amplifyProvider;
  }

  getSessionById(sessionId: string) {
    return this.provider.getSessionById(sessionId);
  }

  getSessions(
    dayIndex: number,
    queryText = '',
    excludeTracks: any[] = [],
    segment = 'all'
  ) {
    return this.provider.getSessions(
      dayIndex,
      queryText,
      excludeTracks,
      segment
    );
  }

  getSpeakerById(speakerId: string) {
    return this.provider.getSpeakerById(speakerId);
  }

  getSpeakers() {
    return this.provider.getSpeakers();
  }

  getTracks() {
    return this.provider.getTracks();
  }

  getLocations() {
    return this.provider.getLocations();
  }
}

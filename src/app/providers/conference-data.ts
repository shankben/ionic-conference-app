import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AmplifyConferenceData } from './amplify/conference-data';
import { FirebaseConferenceData } from './firebase/conference-data';

@Injectable({ providedIn: 'root' })
export class ConferenceData {
  private provider: AmplifyConferenceData | FirebaseConferenceData;

  data: any;

  constructor(
    amplifyProvider: AmplifyConferenceData,
    firebaseProvider: FirebaseConferenceData
  ) {
    this.provider = amplifyProvider;
    window.addEventListener(
      'themeChanged',
      (ev: CustomEvent) => this.provider = ev.detail.isDark ?
        firebaseProvider :
        amplifyProvider
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
    return this.provider.getSessions(
      dayIndex,
      queryText,
      excludeTracks,
      segment
    );
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

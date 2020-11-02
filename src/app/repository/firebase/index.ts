import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { mergeAll } from 'rxjs/operators';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

import {
  Location,
  Session,
  Speaker,
  Track,
  User,
  UserOptions,
  UserUpdate
} from '../../models';


@Injectable({ providedIn: 'root' })
export default class FirebaseStrategy {
  constructor(private readonly afs: AngularFirestore) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user && !user.isAnonymous) {
        window.dispatchEvent(new CustomEvent('user:signin'));
      }
    });
  }


  //// User
  async user(): Promise<User> {
    if (!firebase.auth().currentUser) {
      await firebase.auth().signInAnonymously();
    }
    const user = firebase.auth().currentUser;
    if (user) {
      return {
        isAnonymous: user.isAnonymous ?? false,
        username: user.displayName || user.email,
        email: user.email,
        picture: user.photoURL ?? 'http://www.gravatar.com/avatar'
      };
    }
  }

  async updateUser(userOptions: UserUpdate) {
    const user = firebase.auth().currentUser;
    if (!user) {
      return;
    }
    const { displayName, profilePicture } = userOptions;
    if (displayName) {
      await user.updateProfile({ displayName });
    }
    if (profilePicture) {
      const bucket = firebase.storage().ref();
      try {
        const uid = firebase.auth().currentUser.uid;
        const ref = bucket.child(`/users/${uid}/profilePicture.jpg`);
        await ref.put(profilePicture);
        const photoURL = await ref.getDownloadURL();
        await user.updateProfile({ photoURL });
      } catch (err) {
        console.error(err);
      }
    }
  }

  async signIn(userOptions: UserOptions): Promise<boolean> {
    const { email, password } = userOptions;
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      return window.dispatchEvent(new CustomEvent('user:signin'));
    } catch (err) {
      console.error(err);
    }
  }

  async signOut() {
    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
      firebase.auth().signInAnonymously();
    }
    window.dispatchEvent(new CustomEvent('user:signout'));
  }

  async signUp(userOptions: UserOptions) {
    const { username, email, password } = userOptions;
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      await firebase.auth().currentUser.sendEmailVerification();
      await firebase.auth().currentUser.updateProfile({
        displayName: username
      });
      return window.dispatchEvent(new CustomEvent('user:signup'));
    } catch (err) {
      console.error(err);
    }
  }

  confirmSignup(username: string, code: string) {
    return;
  }

  isSignedIn(): boolean {
    return Boolean(firebase.auth().currentUser);
  }


  //// Sessions
  async toggleLikeSession(sessionId: string) {
    const user = await this.user();
    if (user.isAnonymous) {
      throw new Error('Not signed in');
    }
    const { docs } = await firebase.firestore()
      .collection('sessions')
      .where('id', '==', sessionId)
      .limit(1)
      .get();
    const session = docs.shift();
    const likes = new Set(session.data().likes ?? []);
    if (!likes.has(user.username)) {
      likes.add(user.username);
    } else {
      likes.delete(user.username);
    }
    try {
      await session.ref.update({ likes: Array.from(likes) });
    } catch (err) {
      console.log({err});
    }
  }

  sessionById(sessionId: string): Observable<Session> {
    return this.afs
      .collection<Session>('sessions', (ref) => ref.limit(1)
        .where('id', '==', sessionId))
      .valueChanges()
      .pipe(mergeAll());
  }

  listSessions(): Observable<Session[]> {
    return this.afs
      .collection<Session>('sessions')
      .valueChanges();
  }


  //// Speakers
  speakerById(speakerId: string): Observable<Speaker> {
    return this.afs
      .collection<Speaker>('speakers', (ref) => ref.limit(1)
        .where('id', '==', speakerId))
      .valueChanges()
      .pipe(mergeAll());
  }

  listSpeakers(): Observable<Speaker[]> {
    return this.afs
      .collection<Speaker>('speakers', (ref) => ref.orderBy('name'))
      .valueChanges();
  }


  //// Tracks
  listTracks(): Observable<Track[]> {
    return this.afs
      .collection<Track>('tracks')
      .valueChanges();
  }


  //// Locations
  listLocations(): Observable<Location[]> {
    return this.afs
      .collection<Location>('locations')
      .valueChanges();
  }
}

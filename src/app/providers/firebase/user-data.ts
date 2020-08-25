import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';

import { UserOptions, UserUpdate } from '../../interfaces/user-options';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseUserData {
  private onAuthStateChanged(user: any) {
    if (user) {
      window.dispatchEvent(new CustomEvent('user:login'));
      // console.log({
      //   displayName: user.displayName,
      //   email: user.email,
      //   emailVerified: user.emailVerified,
      //   photoURL: user.photoURL,
      //   isAnonymous: user.isAnonymous,
      //   uid: user.uid,
      //   providerData: user.providerData
      // });
    }
  }

  get user(): any {
    return firebase.auth().currentUser;
  }

  constructor(public storage: Storage) {
    firebase.initializeApp(environment.firebase);
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
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

  async login(userOptions: UserOptions): Promise<any> {
    const { email, password } = userOptions;
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      return window.dispatchEvent(new CustomEvent('user:login'));
    } catch (err) {
      console.error(err);
    }
  }

  async logout(): Promise<any> {
    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
    }
    window.dispatchEvent(new CustomEvent('user:logout'));
  }

  async signup(userOptions: UserOptions): Promise<any> {
    const { email, password } = userOptions;
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      await firebase.auth().currentUser.sendEmailVerification();
      return window.dispatchEvent(new CustomEvent('user:signup'));
    } catch (err) {
      console.error(err);
    }
  }

  async isLoggedIn(): Promise<boolean> {
    return Boolean(firebase.auth().currentUser);
  }
}

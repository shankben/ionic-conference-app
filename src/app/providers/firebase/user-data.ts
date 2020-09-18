import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';

import { UserOptions, UserUpdate } from '../../interfaces/user-options';
import { User } from '../../interfaces/user';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseUserData {
  private onAuthStateChanged(user: any) {
    if (user && !user.isAnonymous) {
      window.dispatchEvent(new CustomEvent('user:signin'));
    }
  }

  constructor() {
    firebase.initializeApp(environment.firebase);
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
    firebase.auth().signInAnonymously();
  }

  async user(): Promise<User> {
    const user = firebase.auth().currentUser;
    if (user) {
      return {
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

  async signIn(userOptions: UserOptions): Promise<any> {
    const { email, password } = userOptions;
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      return window.dispatchEvent(new CustomEvent('user:signin'));
    } catch (err) {
      console.error(err);
    }
  }

  async signOut(): Promise<any> {
    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
    }
    window.dispatchEvent(new CustomEvent('user:signout'));
  }

  async signUp(userOptions: UserOptions): Promise<any> {
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

  async confirmSignup(username: string, code: string): Promise<any> {
    return;
  }

  async isSignedIn(): Promise<boolean> {
    return Boolean(firebase.auth().currentUser);
  }
}

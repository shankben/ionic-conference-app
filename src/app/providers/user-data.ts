import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import { UserOptions, UserUpdate } from '../interfaces/user-options';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserData {
  favorites: string[] = [];
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

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

  async updateUser(userOptions: UserUpdate) {
    const user = firebase.auth().currentUser;
    if (!user) {
      return;
    }
    const { displayName } = userOptions;
    if (!displayName) {
      return;
    }
    await user.updateProfile({
      displayName
    });
  }

  constructor(public storage: Storage) {
    firebase.initializeApp(environment.firebase);
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  hasFavorite(sessionName: string): boolean {
    return (this.favorites.indexOf(sessionName) > -1);
  }

  addFavorite(sessionName: string): void {
    this.favorites.push(sessionName);
  }

  removeFavorite(sessionName: string): void {
    const index = this.favorites.indexOf(sessionName);
    if (index > -1) {
      this.favorites.splice(index, 1);
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

  async checkHasSeenTutorial(): Promise<string> {
    return await this.storage.get(this.HAS_SEEN_TUTORIAL);
  }
}

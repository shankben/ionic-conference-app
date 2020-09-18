import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { UserOptions, UserUpdate } from '../interfaces/user-options';
import { User } from '../interfaces/user';
import { AmplifyUserData } from './amplify/user-data';
import { FirebaseUserData } from './firebase/user-data';

@Injectable({ providedIn: 'root' })
export class UserData {
  private firebaseProvider: FirebaseUserData;
  private amplifyProvider: AmplifyUserData;
  private provider: AmplifyUserData | FirebaseUserData;
  private favorites: string[] = [];

  constructor(private readonly storage: Storage) {
    this.firebaseProvider = new FirebaseUserData();
    this.amplifyProvider = new AmplifyUserData();
    this.provider = this.amplifyProvider;
    window.addEventListener(
      'themeChanged',
      (ev: CustomEvent) => this.provider = !ev.detail.isDark ?
        this.amplifyProvider :
        this.firebaseProvider
    );
  }

  async user(): Promise<User> {
    return await this.provider.user();
  }

  async checkHasSeenTutorial(): Promise<string> {
    return this.storage.get('hasSeenTutorial');
  }

  async updateUser(userOptions: UserUpdate): Promise<any> {
    return this.provider.updateUser(userOptions);
  }

  async signIn(userOptions: UserOptions): Promise<any> {
    return this.provider.signIn(userOptions);
  }

  async signOut(): Promise<any> {
    return this.provider.signOut();
  }

  async signUp(userOptions: UserOptions): Promise<any> {
    return this.provider.signUp(userOptions);
  }

  async confirmSignup(username: string, code: string): Promise<any> {
    return this.provider.confirmSignup(username, code);
  }

  async isSignedIn(): Promise<boolean> {
    return await this.provider.isSignedIn();
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
}

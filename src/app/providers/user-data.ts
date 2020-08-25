import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { UserOptions, UserUpdate } from '../interfaces/user-options';
import { environment } from '../../environments/environment';

import { AmplifyUserData } from './amplify/user-data';
import { FirebaseUserData } from './firebase/user-data';

@Injectable({ providedIn: 'root' })
export class UserData {
  private readonly provider: AmplifyUserData | FirebaseUserData;
  private favorites: string[] = [];

  get user(): any {
    return this.provider.user;
  }

  constructor(public storage: Storage) {
    this.provider = environment.provider === 'firebase' ?
      new FirebaseUserData(storage) :
      new AmplifyUserData(storage);
    console.log(`Using ${environment.provider} provider`);
  }

  async checkHasSeenTutorial(): Promise<string> {
    return this.storage.get('hasSeenTutorial');
  }

  async updateUser(userOptions: UserUpdate): Promise<any> {
    return this.provider.updateUser(userOptions);
  }

  async login(userOptions: UserOptions): Promise<any> {
    return this.provider.login(userOptions);
  }

  async logout(): Promise<any> {
    return this.provider.logout();
  }

  async signup(userOptions: UserOptions): Promise<any> {
    return this.provider.signup(userOptions);
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.provider.isLoggedIn();
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

import { Injectable } from '@angular/core';
import Amplify, { Auth, Storage } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';


// /////////////////////////////
// import API, { graphqlOperation, GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
// import { ListLocationsQuery } from './API.service';
//
// const listLocationsIam = async (): Promise<Array<ListLocationsQuery>> => {
//   const statement = `query ListLocations {
//       listLocations {
//         __typename
//         center
//         city
//         key
//         lat
//         lng
//         name
//         state
//         updatedAt
//         weather {
//           __typename
//           description
//           feelsLike
//           humidity
//           iconUrl
//           pressure
//           status
//           temp
//           tempMax
//           tempMin
//           updatedAt
//         }
//       }
//     }`;
//   const req = {
//     ...graphqlOperation(statement),
//     authMode: GRAPHQL_AUTH_MODE.AWS_IAM
//   };
//   const response = (await API.graphql(req)) as any;
//   return response.data.listLocations;
// };
// /////////////////////////////


import {
  Observable,
  of,
  from,
  merge
} from 'rxjs';

import {
  Location,
  Session,
  Speaker,
  Track,
  Unsubscribable,
  User,
  UserOptions,
  UserUpdate
} from '../../models';

import { environment } from '../../../environments/environment';

import * as utils from './utils';

Amplify.configure(environment.amplify);

import { APIService } from './API.service';

@Injectable({ providedIn: 'root' })
export default class AmplifyStrategy {

  private locationsSubscription: Unsubscribable;

  constructor(private readonly appSyncService: APIService) {
    window.addEventListener('themeChanged', (ev: CustomEvent) => {
      if (ev.detail.isDark && this.locationsSubscription) {
        this.locationsSubscription.unsubscribe();
      }
    });
  }


  //// User
  async user(): Promise<User> {
    try {
      const user = await Auth.currentAuthenticatedUser();
      if (!user.attributes.picture) {
        throw new Error();
      }
      const { picture } = user.attributes;
      const res = await Storage.get(picture, { download: true }) as any;
      const pictureUrl = await utils.blobToDataUrl(res.Body);
      return {
        username: user.attributes.preferred_username || user.username,
        email: user.attributes.email,
        picture: pictureUrl
      };
    } catch (err) {
      return {
        isAnonymous: true,
        email: 'anonymous',
        username: 'anonymous',
        picture: 'http://www.gravatar.com/avatar'
      };
    }
  }

  async updateUser(userOptions: UserUpdate) {
    const user: CognitoUser = await Auth.currentAuthenticatedUser();
    const attributes = await Auth.userAttributes(user);
    const sub = attributes.find((it: any) => it.Name === 'sub').getValue();
    if (!user) {
      return;
    }
    const { displayName, profilePicture } = userOptions;
    if (displayName) {
      await Auth.updateUserAttributes(user, {
        preferred_username: displayName
      });
    }
    if (profilePicture) {
      try {
        await Storage.put(`${sub}.jpg`, profilePicture, {
          contentType: 'image/jpeg'
        });
        await Auth.updateUserAttributes(user, {
          picture: `${sub}.jpg`
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  async signIn(userOptions: UserOptions): Promise<boolean> {
    const { email, password } = userOptions;
    try {
      await Auth.signIn(email, password);
      return window.dispatchEvent(new CustomEvent('user:signin'));
    } catch (err) {
      console.error(err);
    }
  }

  async signOut() {
    try {
      await Auth.signOut();
      window.dispatchEvent(new CustomEvent('user:signout'));
    } catch (err) {
      // OK: Sign out unconditionally
    }
  }

  async confirmSignup(username: string, code: string) {
    try {
      await Auth.confirmSignUp(username, code);
    } catch (err) {
      console.error(err);
    }
  }

  async signUp(userOptions: UserOptions) {
    const { username, email, password } = userOptions;
    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          email
        }
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async isSignedIn(): Promise<boolean> {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return Boolean(user) && !user.isAnonymous;
    } catch (err) {
      return false;
    }
  }


  //// Sessions
  toggleLikeSession(sessionId: string): Observable<void> {
    return;
  }

  sessionById(sessionId: string): Observable<Session> {
    return from(this.appSyncService.GetSession(sessionId))
      .pipe(utils.keyToId());
  }

  listSessions(): Observable<Session[]> {
    return from(this.appSyncService.ListSessions()).pipe(utils.keysToIds());
  }


  //// Speakers
  speakerById(speakerId: string): Observable<Speaker> {
    return from(this.appSyncService.GetSpeaker(speakerId))
      .pipe(utils.keyToId());
  }

  listSpeakers(): Observable<Speaker[]> {
    return from(this.appSyncService.ListSpeakers())
      .pipe(utils.keysToIds())
      .pipe(utils.sortByName());
  }


  //// Tracks
  listTracks(): Observable<Track[]> {
    return from(this.appSyncService.ListTracks());
  }


  //// Locations
  listLocations(): Observable<Location[]> {
    // listLocationsIam().then((res) => {
    //   console.log(res);
    // });


    try {
      this.locationsSubscription.unsubscribe();
    } catch (err) {
      // OK: Always unconditionally unsubscribe
    }
    const {
      observable,
      subscription
    } = utils.observableFromSubscription(
      this.appSyncService.UpdatedLocationListener
    );
    this.locationsSubscription = subscription;

    // let data;
    // try {
    //   data = await this.appSyncService.ListLocations();
    //   data = data.data;
    // } catch (err) {
    //   data = err.data;
    // }

    // const listLocations = from(data.data);
    // const listLocations = of(data);


    return merge(this.appSyncService.ListLocations(), observable);
  }
}

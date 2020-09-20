/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.
import { Injectable } from "@angular/core";
import API, { graphqlOperation } from "@aws-amplify/api";
import { GraphQLResult } from "@aws-amplify/api/lib/types";
import { Observable } from "zen-observable-ts";

export type LocationInput = {
  key: string;
};

export type SessionInput = {
  key: string;
};

export type SpeakerInput = {
  key: string;
};

export type TrackInput = {
  key: string;
};

export type UpdateLocationMutation = {
  __typename: "Location";
  center: boolean | null;
  city: string;
  key: string;
  lat: number;
  lng: number;
  name: string;
  state: string;
  updatedAt: string;
  weather: {
    __typename: "LocationWeather";
    description: string;
    feelsLike: number;
    humidity: number;
    iconUrl: string;
    pressure: number;
    status: string;
    temp: number;
    tempMax: number;
    tempMin: number;
    updatedAt: string;
  } | null;
};

export type UpdateSessionMutation = {
  __typename: "Session";
  date: string;
  description: string | null;
  groupId: string;
  id: string;
  key: string;
  location: string;
  name: string;
  speakerNames: Array<string> | null;
  timeEnd: string;
  timeStart: string;
  tracks: Array<string>;
  updatedAt: string;
};

export type UpdateSpeakerMutation = {
  __typename: "Speaker";
  about: string;
  email: string;
  id: string;
  instagram: string;
  key: string;
  location: string;
  name: string;
  phone: string;
  profilePic: string;
  title: string;
  twitter: string;
  updatedAt: string;
};

export type UpdateTrackMutation = {
  __typename: "Track";
  icon: string;
  key: string;
  name: string;
  updatedAt: string;
};

export type GetLocationQuery = {
  __typename: "Location";
  center: boolean | null;
  city: string;
  key: string;
  lat: number;
  lng: number;
  name: string;
  state: string;
  updatedAt: string;
  weather: {
    __typename: "LocationWeather";
    description: string;
    feelsLike: number;
    humidity: number;
    iconUrl: string;
    pressure: number;
    status: string;
    temp: number;
    tempMax: number;
    tempMin: number;
    updatedAt: string;
  } | null;
};

export type GetSessionQuery = {
  __typename: "Session";
  date: string;
  description: string | null;
  groupId: string;
  id: string;
  key: string;
  location: string;
  name: string;
  speakerNames: Array<string> | null;
  timeEnd: string;
  timeStart: string;
  tracks: Array<string>;
  updatedAt: string;
};

export type GetSpeakerQuery = {
  __typename: "Speaker";
  about: string;
  email: string;
  id: string;
  instagram: string;
  key: string;
  location: string;
  name: string;
  phone: string;
  profilePic: string;
  title: string;
  twitter: string;
  updatedAt: string;
};

export type GetTrackQuery = {
  __typename: "Track";
  icon: string;
  key: string;
  name: string;
  updatedAt: string;
};

export type ListLocationsQuery = {
  __typename: "Location";
  center: boolean | null;
  city: string;
  key: string;
  lat: number;
  lng: number;
  name: string;
  state: string;
  updatedAt: string;
  weather: {
    __typename: "LocationWeather";
    description: string;
    feelsLike: number;
    humidity: number;
    iconUrl: string;
    pressure: number;
    status: string;
    temp: number;
    tempMax: number;
    tempMin: number;
    updatedAt: string;
  } | null;
};

export type ListSessionsQuery = {
  __typename: "Session";
  date: string;
  description: string | null;
  groupId: string;
  id: string;
  key: string;
  location: string;
  name: string;
  speakerNames: Array<string> | null;
  timeEnd: string;
  timeStart: string;
  tracks: Array<string>;
  updatedAt: string;
};

export type ListSpeakersQuery = {
  __typename: "Speaker";
  about: string;
  email: string;
  id: string;
  instagram: string;
  key: string;
  location: string;
  name: string;
  phone: string;
  profilePic: string;
  title: string;
  twitter: string;
  updatedAt: string;
};

export type ListTracksQuery = {
  __typename: "Track";
  icon: string;
  key: string;
  name: string;
  updatedAt: string;
};

export type UpdatedLocationSubscription = {
  __typename: "Location";
  center: boolean | null;
  city: string;
  key: string;
  lat: number;
  lng: number;
  name: string;
  state: string;
  updatedAt: string;
  weather: {
    __typename: "LocationWeather";
    description: string;
    feelsLike: number;
    humidity: number;
    iconUrl: string;
    pressure: number;
    status: string;
    temp: number;
    tempMax: number;
    tempMin: number;
    updatedAt: string;
  } | null;
};

export type UpdatedSessionSubscription = {
  __typename: "Session";
  date: string;
  description: string | null;
  groupId: string;
  id: string;
  key: string;
  location: string;
  name: string;
  speakerNames: Array<string> | null;
  timeEnd: string;
  timeStart: string;
  tracks: Array<string>;
  updatedAt: string;
};

export type UpdatedSpeakerSubscription = {
  __typename: "Speaker";
  about: string;
  email: string;
  id: string;
  instagram: string;
  key: string;
  location: string;
  name: string;
  phone: string;
  profilePic: string;
  title: string;
  twitter: string;
  updatedAt: string;
};

export type UpdatedTrackSubscription = {
  __typename: "Track";
  icon: string;
  key: string;
  name: string;
  updatedAt: string;
};

@Injectable({
  providedIn: "root"
})
export class APIService {
  async UpdateLocation(input: LocationInput): Promise<UpdateLocationMutation> {
    const statement = `mutation UpdateLocation($input: LocationInput!) {
        updateLocation(input: $input) {
          __typename
          center
          city
          key
          lat
          lng
          name
          state
          updatedAt
          weather {
            __typename
            description
            feelsLike
            humidity
            iconUrl
            pressure
            status
            temp
            tempMax
            tempMin
            updatedAt
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateLocationMutation>response.data.updateLocation;
  }
  async UpdateSession(input: SessionInput): Promise<UpdateSessionMutation> {
    const statement = `mutation UpdateSession($input: SessionInput!) {
        updateSession(input: $input) {
          __typename
          date
          description
          groupId
          id
          key
          location
          name
          speakerNames
          timeEnd
          timeStart
          tracks
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateSessionMutation>response.data.updateSession;
  }
  async UpdateSpeaker(input: SpeakerInput): Promise<UpdateSpeakerMutation> {
    const statement = `mutation UpdateSpeaker($input: SpeakerInput!) {
        updateSpeaker(input: $input) {
          __typename
          about
          email
          id
          instagram
          key
          location
          name
          phone
          profilePic
          title
          twitter
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateSpeakerMutation>response.data.updateSpeaker;
  }
  async UpdateTrack(input: TrackInput): Promise<UpdateTrackMutation> {
    const statement = `mutation UpdateTrack($input: TrackInput!) {
        updateTrack(input: $input) {
          __typename
          icon
          key
          name
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateTrackMutation>response.data.updateTrack;
  }
  async GetLocation(key: string): Promise<GetLocationQuery> {
    const statement = `query GetLocation($key: ID!) {
        getLocation(key: $key) {
          __typename
          center
          city
          key
          lat
          lng
          name
          state
          updatedAt
          weather {
            __typename
            description
            feelsLike
            humidity
            iconUrl
            pressure
            status
            temp
            tempMax
            tempMin
            updatedAt
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {
      key
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetLocationQuery>response.data.getLocation;
  }
  async GetSession(key: string): Promise<GetSessionQuery> {
    const statement = `query GetSession($key: ID!) {
        getSession(key: $key) {
          __typename
          date
          description
          groupId
          id
          key
          location
          name
          speakerNames
          timeEnd
          timeStart
          tracks
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      key
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetSessionQuery>response.data.getSession;
  }
  async GetSpeaker(key: string): Promise<GetSpeakerQuery> {
    const statement = `query GetSpeaker($key: ID!) {
        getSpeaker(key: $key) {
          __typename
          about
          email
          id
          instagram
          key
          location
          name
          phone
          profilePic
          title
          twitter
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      key
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetSpeakerQuery>response.data.getSpeaker;
  }
  async GetTrack(key: string): Promise<GetTrackQuery> {
    const statement = `query GetTrack($key: ID!) {
        getTrack(key: $key) {
          __typename
          icon
          key
          name
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      key
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetTrackQuery>response.data.getTrack;
  }
  async ListLocations(): Promise<Array<ListLocationsQuery>> {
    const statement = `query ListLocations {
        listLocations {
          __typename
          center
          city
          key
          lat
          lng
          name
          state
          updatedAt
          weather {
            __typename
            description
            feelsLike
            humidity
            iconUrl
            pressure
            status
            temp
            tempMax
            tempMin
            updatedAt
          }
        }
      }`;
    const response = (await API.graphql(graphqlOperation(statement))) as any;
    return <Array<ListLocationsQuery>>response.data.listLocations;
  }
  async ListSessions(): Promise<Array<ListSessionsQuery>> {
    const statement = `query ListSessions {
        listSessions {
          __typename
          date
          description
          groupId
          id
          key
          location
          name
          speakerNames
          timeEnd
          timeStart
          tracks
          updatedAt
        }
      }`;
    const response = (await API.graphql(graphqlOperation(statement))) as any;
    return <Array<ListSessionsQuery>>response.data.listSessions;
  }
  async ListSpeakers(): Promise<Array<ListSpeakersQuery>> {
    const statement = `query ListSpeakers {
        listSpeakers {
          __typename
          about
          email
          id
          instagram
          key
          location
          name
          phone
          profilePic
          title
          twitter
          updatedAt
        }
      }`;
    const response = (await API.graphql(graphqlOperation(statement))) as any;
    return <Array<ListSpeakersQuery>>response.data.listSpeakers;
  }
  async ListTracks(): Promise<Array<ListTracksQuery>> {
    const statement = `query ListTracks {
        listTracks {
          __typename
          icon
          key
          name
          updatedAt
        }
      }`;
    const response = (await API.graphql(graphqlOperation(statement))) as any;
    return <Array<ListTracksQuery>>response.data.listTracks;
  }
  UpdatedLocationListener: Observable<
    UpdatedLocationSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription UpdatedLocation {
        updatedLocation {
          __typename
          center
          city
          key
          lat
          lng
          name
          state
          updatedAt
          weather {
            __typename
            description
            feelsLike
            humidity
            iconUrl
            pressure
            status
            temp
            tempMax
            tempMin
            updatedAt
          }
        }
      }`
    )
  ) as Observable<UpdatedLocationSubscription>;

  UpdatedSessionListener: Observable<UpdatedSessionSubscription> = API.graphql(
    graphqlOperation(
      `subscription UpdatedSession {
        updatedSession {
          __typename
          date
          description
          groupId
          id
          key
          location
          name
          speakerNames
          timeEnd
          timeStart
          tracks
          updatedAt
        }
      }`
    )
  ) as Observable<UpdatedSessionSubscription>;

  UpdatedSpeakerListener: Observable<UpdatedSpeakerSubscription> = API.graphql(
    graphqlOperation(
      `subscription UpdatedSpeaker {
        updatedSpeaker {
          __typename
          about
          email
          id
          instagram
          key
          location
          name
          phone
          profilePic
          title
          twitter
          updatedAt
        }
      }`
    )
  ) as Observable<UpdatedSpeakerSubscription>;

  UpdatedTrackListener: Observable<UpdatedTrackSubscription> = API.graphql(
    graphqlOperation(
      `subscription UpdatedTrack {
        updatedTrack {
          __typename
          icon
          key
          name
          updatedAt
        }
      }`
    )
  ) as Observable<UpdatedTrackSubscription>;
}

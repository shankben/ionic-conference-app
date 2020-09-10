/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.
import { Injectable } from "@angular/core";
import API, { graphqlOperation } from "@aws-amplify/api";
import { GraphQLResult } from "@aws-amplify/api/lib/types";
import { Observable } from "zen-observable-ts";

export type GetComplexityQuery = {
  __typename: "Complexity";
  family_D_genus_D_name: string;
  family_D_genus_D_species_D_commonName: string;
  family_D_genus_D_species_D_name: string;
  family_D_name: string;
  key: string;
  number: number;
  updatedAt: string;
};

export type GetLocationQuery = {
  __typename: "Location";
  center: boolean | null;
  key: string;
  lat: number;
  lng: number;
  name: string;
  updatedAt: string;
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

export type ListComplexitiesQuery = {
  __typename: "Complexity";
  family_D_genus_D_name: string;
  family_D_genus_D_species_D_commonName: string;
  family_D_genus_D_species_D_name: string;
  family_D_name: string;
  key: string;
  number: number;
  updatedAt: string;
};

export type ListLocationsQuery = {
  __typename: "Location";
  center: boolean | null;
  key: string;
  lat: number;
  lng: number;
  name: string;
  updatedAt: string;
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

@Injectable({
  providedIn: "root"
})
export class APIService {
  async GetComplexity(key?: string): Promise<GetComplexityQuery> {
    const statement = `query GetComplexity($key: String) {
        getComplexity(key: $key) {
          __typename
          family_D_genus_D_name
          family_D_genus_D_species_D_commonName
          family_D_genus_D_species_D_name
          family_D_name
          key
          number
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (key) {
      gqlAPIServiceArguments.key = key;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetComplexityQuery>response.data.getComplexity;
  }
  async GetLocation(key?: string): Promise<GetLocationQuery> {
    const statement = `query GetLocation($key: String) {
        getLocation(key: $key) {
          __typename
          center
          key
          lat
          lng
          name
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (key) {
      gqlAPIServiceArguments.key = key;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetLocationQuery>response.data.getLocation;
  }
  async GetSession(key?: string): Promise<GetSessionQuery> {
    const statement = `query GetSession($key: String) {
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
    const gqlAPIServiceArguments: any = {};
    if (key) {
      gqlAPIServiceArguments.key = key;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetSessionQuery>response.data.getSession;
  }
  async GetSpeaker(key?: string): Promise<GetSpeakerQuery> {
    const statement = `query GetSpeaker($key: String) {
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
    const gqlAPIServiceArguments: any = {};
    if (key) {
      gqlAPIServiceArguments.key = key;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetSpeakerQuery>response.data.getSpeaker;
  }
  async GetTrack(key?: string): Promise<GetTrackQuery> {
    const statement = `query GetTrack($key: String) {
        getTrack(key: $key) {
          __typename
          icon
          key
          name
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (key) {
      gqlAPIServiceArguments.key = key;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetTrackQuery>response.data.getTrack;
  }
  async ListComplexities(): Promise<Array<ListComplexitiesQuery>> {
    const statement = `query ListComplexities {
        listComplexities {
          __typename
          family_D_genus_D_name
          family_D_genus_D_species_D_commonName
          family_D_genus_D_species_D_name
          family_D_name
          key
          number
          updatedAt
        }
      }`;
    const response = (await API.graphql(graphqlOperation(statement))) as any;
    return <Array<ListComplexitiesQuery>>response.data.listComplexities;
  }
  async ListLocations(): Promise<Array<ListLocationsQuery>> {
    const statement = `query ListLocations {
        listLocations {
          __typename
          center
          key
          lat
          lng
          name
          updatedAt
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
}

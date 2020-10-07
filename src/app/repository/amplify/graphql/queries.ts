/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getLocation = /* GraphQL */ `
  query GetLocation($key: ID!) {
    getLocation(key: $key) {
      center
      city
      key
      lat
      lng
      name
      state
      updatedAt
      weather {
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
  }
`;
export const getSession = /* GraphQL */ `
  query GetSession($key: ID!) {
    getSession(key: $key) {
      date
      description
      groupId
      id
      key
      likes
      location
      name
      speakerNames
      timeEnd
      timeStart
      tracks
      updatedAt
    }
  }
`;
export const getSpeaker = /* GraphQL */ `
  query GetSpeaker($key: ID!) {
    getSpeaker(key: $key) {
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
  }
`;
export const getTrack = /* GraphQL */ `
  query GetTrack($key: ID!) {
    getTrack(key: $key) {
      icon
      key
      name
      updatedAt
    }
  }
`;
export const listLocations = /* GraphQL */ `
  query ListLocations {
    listLocations {
      center
      city
      key
      lat
      lng
      name
      state
      updatedAt
      weather {
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
  }
`;
export const listSessions = /* GraphQL */ `
  query ListSessions {
    listSessions {
      date
      description
      groupId
      id
      key
      likes
      location
      name
      speakerNames
      timeEnd
      timeStart
      tracks
      updatedAt
    }
  }
`;
export const listSpeakers = /* GraphQL */ `
  query ListSpeakers {
    listSpeakers {
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
  }
`;
export const listTracks = /* GraphQL */ `
  query ListTracks {
    listTracks {
      icon
      key
      name
      updatedAt
    }
  }
`;

/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const updateLocation = /* GraphQL */ `
  mutation UpdateLocation($input: LocationInput!) {
    updateLocation(input: $input) {
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
export const updateSession = /* GraphQL */ `
  mutation UpdateSession($input: SessionInput!) {
    updateSession(input: $input) {
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
export const updateSpeaker = /* GraphQL */ `
  mutation UpdateSpeaker($input: SpeakerInput!) {
    updateSpeaker(input: $input) {
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
export const updateTrack = /* GraphQL */ `
  mutation UpdateTrack($input: TrackInput!) {
    updateTrack(input: $input) {
      icon
      key
      name
      updatedAt
    }
  }
`;

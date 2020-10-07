/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const updatedLocation = /* GraphQL */ `
  subscription UpdatedLocation {
    updatedLocation {
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
export const updatedSession = /* GraphQL */ `
  subscription UpdatedSession {
    updatedSession {
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
export const updatedSpeaker = /* GraphQL */ `
  subscription UpdatedSpeaker {
    updatedSpeaker {
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
export const updatedTrack = /* GraphQL */ `
  subscription UpdatedTrack {
    updatedTrack {
      icon
      key
      name
      updatedAt
    }
  }
`;

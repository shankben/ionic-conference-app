//// Session
export interface SessionGroupItem {
  time?: string;
  hide: boolean;
  sessions: Session[];
}

export interface SessionGroup {
  shownSessions: number;
  groups: SessionGroupItem[];
}

export interface Session {
  date: string;
  description: string | null;
  groupId: string;
  hide: boolean | null;
  id: string;
  key: string;
  location: string;
  name: string;
  speakerNames: Array<string> | null;
  timeEnd: string;
  timeStart: string;
  tracks: Array<string>;
  updatedAt: string;
}


//// User
export interface UserOptions {
  email: string;
  password: string;
  username: string;
}

export interface UserUpdate {
  displayName?: string;
  profilePicture?: File;
}

export interface User {
  email: string;
  picture: string;
  username: string;
}


//// Speaker
export interface Speaker {
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
}

//// Track
export interface Track {
  icon: string;
  key: string;
  name: string;
  updatedAt: string;
}


//// Location
export interface LocationWeather {
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
}

export interface Location {
  center: boolean | null;
  city: string;
  key: string;
  lat: number;
  lng: number;
  name: string;
  state: string;
  updatedAt: string;
  weather?: LocationWeather;
}

//// Utility
export interface KeyIdLike {
  key: string;
  id: string;
}

export interface NameLike {
  name: string;
}

export interface Unsubscribable {
  unsubscribe(): void;
}

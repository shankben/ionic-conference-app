export interface Session {
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
  hide: boolean | null;
}

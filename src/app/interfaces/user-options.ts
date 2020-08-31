export interface UserOptions {
  username: string;
  email: string;
  password: string;
}

export interface UserUpdate {
  displayName?: string;
  profilePicture?: File;
}

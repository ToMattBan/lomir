export interface IUsersFileInfo {
  sha: string;
  content: { [key: string]: IUser; };
  refreshInfo: (() => Promise<void>) | null;
}

export interface IUser {
  name: string;
  race: string;
  image: string;
  backstory: string;
}

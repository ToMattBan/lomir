import type { IUsersFileInfo } from './userInfo';

export interface IExtendedWindow extends Window { stores?: { users: IUsersFileInfo; }; }

import type { ICampaignFileInfo, IUsersFileInfo } from './storesInfo';

export interface IExtendedWindow extends Window {
  stores?: {
    users: IUsersFileInfo;
    campaign: ICampaignFileInfo;
  };
}

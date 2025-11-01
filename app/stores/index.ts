import type { ICampaignFileInfo, IUsersFileInfo } from '~/interfaces/storesInfo';
import usersFileInfo from './usersFileInfo.json';
import campaignFileInfo from './campaignFileInfo.json';
import type { IExtendedWindow } from '~/interfaces/global';

const typedUserFile = reactive<IUsersFileInfo>(usersFileInfo);
const typedCampaignFile = reactive<ICampaignFileInfo>(campaignFileInfo);

async function getUsersInfo() {
  const { sha, content } = await $fetch('/api/usersFile/getAll', { method: 'GET' });

  typedUserFile.sha = sha;
  typedUserFile.content = content;
}

async function getCampaignInfo() {
  const { sha, content } = await $fetch('/api/campaign/getAll', { method: 'GET' });

  typedCampaignFile.sha = sha;
  typedCampaignFile.checklist = content;
}

export default async function init() {
  typedUserFile.refreshInfo = getUsersInfo;
  getUsersInfo();

  typedCampaignFile.refreshInfo = getCampaignInfo;
  getCampaignInfo();

  (window as IExtendedWindow).stores = { users: usersFileInfo, campaign: campaignFileInfo };
}

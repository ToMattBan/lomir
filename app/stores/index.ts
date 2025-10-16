import type { IUsersFileInfo } from '@/interfaces/userInfo';
import usersFileInfo from './usersFileInfo.json';

const typedUserFile = reactive<IUsersFileInfo>(usersFileInfo);

async function getUsersInfo() {
  const { sha, content } = await $fetch('/api/usersFile/getAll', { method: 'GET' });

  typedUserFile.sha = sha;
  typedUserFile.content = content;
}

export default async function init() {
  typedUserFile.refreshInfo = getUsersInfo;
}

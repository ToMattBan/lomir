import type { IUser, IUsersFileInfo } from '~/interfaces/userInfo';
import usersFileInfo from '@/stores/usersFileInfo.json';

const typedUserFile = reactive<IUsersFileInfo>(usersFileInfo);

export async function updateUser(sha: string, user: IUser): Promise<string> {
  const allContent = typedUserFile.content;

  allContent[user.name] = user;

  const newSha = await $fetch('/api/usersFile/updateFile', { body: { sha, content: allContent }, method: 'POST' });
  typedUserFile.sha = newSha;

  return newSha;
}

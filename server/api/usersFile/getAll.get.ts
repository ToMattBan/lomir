import { octokit } from '@@/utils/octokit';

export default defineEventHandler(async () => {
  const usersData = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: 'ToMattBan',
    repo: 'lomir',
    path: 'users.json',
    ref: 'db',
    headers: { 'X-GitHub-Api-Version': '2022-11-28' },
  });

  const returnObject = {
    sha: '',
    content: {},
  };

  // Just some checkings to not throw TS errors as the EP above can return 4 different type of stuff
  if (!Array.isArray(usersData.data) && usersData.data.type === 'file') {
    returnObject.sha = usersData.data.sha;
    returnObject.content = JSON.parse(atob(usersData.data.content));
  }

  return returnObject;
});

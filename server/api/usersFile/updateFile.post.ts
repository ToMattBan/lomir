import { octokit } from '@@/utils/octokit';

export default defineEventHandler(async (event) => {
  const { sha, content } = await readBody(event);

  const newFileData = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: 'ToMattBan',
    repo: 'lomir',
    path: 'users.json',
    branch: 'db',
    message: 'new User',
    sha: sha,
    committer: {
      name: process.env.GTH_NM as string,
      email: process.env.GTH_EM as string,
    },
    content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
    headers: { 'X-GitHub-Api-Version': '2022-11-28' },
  });

  if (newFileData.data.commit.sha) {
    return newFileData.data.commit.sha;
  }

  return '';
});

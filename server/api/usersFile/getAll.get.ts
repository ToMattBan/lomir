import { octokit } from '@@/utils/octokit';

export default defineEventHandler(async () => {
  try {
    const fileMetadata = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
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

    if (!Array.isArray(fileMetadata.data) && fileMetadata.data.type === 'file') {
      returnObject.sha = fileMetadata.data.sha;

      const blobData = await octokit.request('GET /repos/{owner}/{repo}/git/blobs/{file_sha}', {
        owner: 'ToMattBan',
        repo: 'lomir',
        file_sha: fileMetadata.data.sha,
        headers: { 'X-GitHub-Api-Version': '2022-11-28' },
      });

      if (blobData.data.content) {
        const content = Buffer.from(blobData.data.content, 'base64').toString('utf-8');
        returnObject.content = JSON.parse(content);
      }
    }

    return returnObject;

  } catch (error) {
    console.error('Error fetching file:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch users data',
    });
  }
});

import { Octokit } from 'octokit';

export const octokit = new Octokit({ auth: process.env.GTH_TK });

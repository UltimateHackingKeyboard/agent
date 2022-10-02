import { Octokit } from '@octokit/rest';

export interface GetCommitShaOfGitRefOptions {
    owner: string;
    repo: string;
    ref: string;
}

export async function getCommitShortShaOfGitRef(options: GetCommitShaOfGitRefOptions): Promise<string> {
    const octokit = new Octokit();

    const commitInfo = await octokit.repos.getCommit({
        owner: options.owner,
        repo: options.repo,
        ref: options.ref
    });

    return commitInfo.data.sha.substring(0, 7);
}

import { Octokit } from '@octokit/rest';

export interface GetCommitShaOfGitTagOptions {
    owner: string;
    repo: string;
    tag: string;
}

export async function getCommitShaOfGitTag(options: GetCommitShaOfGitTagOptions): Promise<string> {
    const octokit = new Octokit();

    const tagRef = await octokit.git.getRef({
        owner: options.owner,
        repo: options.repo,
        ref: `tags/${options.tag}`,
    });

    const tagShaRef = await octokit.git.getTag({
        owner: options.owner,
        repo: options.repo,
        tag_sha: tagRef.data.object.sha
    });

    return tagShaRef.data.object.sha;
}

import { Octokit } from '@octokit/rest';
import { downloadTreeToFolder } from './download-tree-to-folder.js';

import { findDirShaFromTree } from './find-tree-sha-from-tree.js';

export interface DownloadSmartMacroDocOptions {
    owner: string;
    repo: string;
    ref: string;
    directory: string;
}

export async function downloadSmartMacroDoc(options: DownloadSmartMacroDocOptions): Promise<void> {
    const octokit = new Octokit();

    const commitInfo = await octokit.repos.getCommit({
        owner: options.owner,
        repo: options.repo,
        ref: options.ref
    });

    const docDirSha = await findDirShaFromTree({
        owner: options.owner,
        repo: options.repo,
        sha: commitInfo.data.commit.tree.sha,
        dir: 'doc'
    });

    const docDistDirSha = await findDirShaFromTree({
        owner: options.owner,
        repo: options.repo,
        sha: docDirSha,
        dir: 'dist'
    });

    await downloadTreeToFolder({
        commitSha: options.ref,
        owner: options.owner,
        repo: options.repo,
        treeSha: docDistDirSha,
        gitDirectory: 'doc/dist',
        downloadDirectory: options.directory
    });
}

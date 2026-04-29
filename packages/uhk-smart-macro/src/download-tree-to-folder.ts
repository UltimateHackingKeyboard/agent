import * as path from 'path';
import urlJoin from 'url-join';
import fs from 'fs-extra';
import { Octokit } from '@octokit/rest';

import { downloadFile } from './download-file.js';

export interface DownloadTreeToFolderOptions {
    commitSha: string;
    owner: string;
    repo: string;
    treeSha: string;
    gitDirectory: string;
    downloadDirectory: string;
}

export async function downloadTreeToFolder(options: DownloadTreeToFolderOptions): Promise<void> {
    await fs.ensureDir(options.downloadDirectory);

    const octokit = new Octokit();

    const dirTree = await octokit.git.getTree({
        owner: options.owner,
        repo: options.repo,
        tree_sha: options.treeSha,
        recursive: 'true'
    });

    for (const node of dirTree.data.tree) {
        if (node.type !== 'blob')
            continue;

        const pathSplit = node.path.split('/');

        if (pathSplit.length > 1) {
            const subDir = path.join(options.downloadDirectory, ...pathSplit.slice(0, -1));
            await fs.ensureDir(subDir);
        }

        const githubRawUrl = urlJoin(
            'https://raw.githubusercontent.com',
            options.owner,
            options.repo,
            options.commitSha,
            options.gitDirectory,
            node.path
        );

        const filePath = path.join(options.downloadDirectory, node.path);
        await downloadFile(githubRawUrl, filePath);
    }
}

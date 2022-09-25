import { Octokit } from '@octokit/rest';

import { CannotFindDirError } from './cannot-find-dir-error.js';
import { FindTreeShaFromTreeOptions } from './find-tree-sha-from-tree-options.js';

const octokit = new Octokit();

export async function findDirShaFromTree(options: FindTreeShaFromTreeOptions): Promise<string> {
    const commitInfo = await octokit.git.getTree({
        owner: options.owner,
        repo: options.repo,
        tree_sha: options.sha
    });

    const tree = commitInfo.data.tree.find(tree => {
        return tree.type === 'tree' && tree.path === options.dir;
    });

    if (!tree)
        throw new CannotFindDirError(options);

    return tree.sha;
}

import { describe, it } from 'node:test';

import { getCommitShortShaOfGitRef } from './get-commit-short-sha-of-git-ref.js';

describe('getCommitShaOfGitTag', () => {
    it('should return with the commit sha', async ({ assert }) => {
        const sha = await getCommitShortShaOfGitRef({
            owner: 'UltimateHackingKeyboard',
            repo: 'firmware',
            ref: 'v9.0.1'
        });

        assert.strictEqual(sha, '885a92a');
    });
});

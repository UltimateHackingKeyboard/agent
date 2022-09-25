import { getCommitShaOfGitTag } from './get-commit-sha-of-git-tag.js';

describe('getCommitShaOfGitTag', () => {
    it('should return with the commit sha', async () => {
        const sha = await getCommitShaOfGitTag({
            owner: 'UltimateHackingKeyboard',
            repo: 'firmware',
            tag: 'v9.0.1'
        });

        expect(sha).toEqual('885a92a0d6b730fcb74ac7fd7c256d10ab215750');
    });
});

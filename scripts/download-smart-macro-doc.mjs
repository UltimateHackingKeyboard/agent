import * as desm from 'desm';
import fse from 'fs-extra';

import {downloadSmartMacroDoc, getCommitShortShaOfGitRef} from '../packages/uhk-smart-macro/dist/index.js';
import {UHK_OFFICIAL_FIRMWARE_REPO} from '../packages/uhk-common/dist/index.js';

async function readPackageInfo() {
    const filePath = desm.join(import.meta.url, '..', 'package.json');

    return fse.readJson(filePath, {encoding: 'utf-8'});
}

(async function main() {
    const packageJson = await readPackageInfo();
    const [owner, repo] = UHK_OFFICIAL_FIRMWARE_REPO.split('/')
    const gitCommitSha = await getCommitShortShaOfGitRef({
        owner,
        repo,
        ref: `v${packageJson.firmwareVersion}`
    });
    const smartMacroTmpDir = desm.join(import.meta.url, '..', 'tmp', 'smart-macro-docs', owner, repo, gitCommitSha);

    // GitHub API anonymous rate limit is 60 request/hour, so we have to care about it
    if (!await fse.pathExists(smartMacroTmpDir)) {
        await downloadSmartMacroDoc({
            owner,
            repo,
            ref: gitCommitSha,
            directory: smartMacroTmpDir
        })
    }

    const loadingHtmlFilename = 'loading.html';
    await fse.copy(
        desm.join(import.meta.url, '..', 'smart-macro-docs', loadingHtmlFilename),
        desm.join(import.meta.url, '..', 'tmp', 'smart-macro-docs', loadingHtmlFilename)
    )
})();

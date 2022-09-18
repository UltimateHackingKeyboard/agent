import getGitTagInfo from '../packages/uhk-smart-macro/dist/get-git-tag-info.js';
import {UHK_OFFICIAL_FIRMWARE_REPO} from '../packages/uhk-common/dist/util/is-official-uhk-firmware.js';

(async function main() {
    const gitTagRef = await getGitTagInfo(UHK_OFFICIAL_FIRMWARE_REPO, '9.0.1');
    console.log(gitTagRef);
})();

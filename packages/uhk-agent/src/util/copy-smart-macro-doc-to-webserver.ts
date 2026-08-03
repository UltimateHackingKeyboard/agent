import { cp } from 'fs/promises';
import path from 'path';
import { LogService } from 'uhk-common';
import { pathExists } from 'uhk-fs';
import {getFirmwarePackageJson,TmpFirmware} from 'uhk-usb';

import { getSmartMacroDocRootPath } from './get-smart-macro-doc-root-path';
import { makeFolderWriteableToUserOnLinux } from './make-folder-writeable-to-user-on-linux';

export async function copySmartMacroDocToWebserver(firmwarePath: TmpFirmware, logger: LogService): Promise<void> {
    logger.misc('[SmartMacroCopy] start');
    const { gitInfo } = await getFirmwarePackageJson(firmwarePath);

    if (!gitInfo) {
        logger.misc('[SmartMacroCopy] firmware package.json does not contain gitInfo');
        return;
    }

    const [owner, repo] = gitInfo.repo.split('/');
    const destination = path.join(getSmartMacroDocRootPath(), owner, repo, gitInfo.tag);
    const smartMacroDocFirmwarePath = path.join(firmwarePath.tmpDirectory, 'doc');
    logger.misc('[SmartMacroCopy] copy', {
        destination,
        smartMacroDocFirmwarePath
    });

    // fs.cp preserves source directory modes. When the install prefix is
    // immutable (e.g. the Nix store, mode 0555), the first copy creates
    // `destination` as dr-xr-xr-x. A prior failed run can also leave such a
    // tree behind. Make an existing destination writable before force-copy
    // so unlink of its contents cannot EACCES, then make it writable again
    // before the nested doc-dev copy which needs to mkdir inside it.
    // See UltimateHackingKeyboard/agent#2652, #2679 and PR #2680.
    if (await pathExists(destination)) {
        await makeFolderWriteableToUserOnLinux(destination);
    }

    await cp(smartMacroDocFirmwarePath, destination, { force: true, recursive: true });

    await makeFolderWriteableToUserOnLinux(destination);

    const referenceManualFirmwarePath = path.join(firmwarePath.tmpDirectory, 'doc-dev');
    const referenceManualDestination = path.join(destination, 'doc-dev');
    await cp(referenceManualFirmwarePath, referenceManualDestination, { force: true, recursive: true });

    logger.misc('[SmartMacroCopy] done');
}

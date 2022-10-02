import { copy } from 'fs-extra';
import path from 'path';
import { LogService } from 'uhk-common';
import {getFirmwarePackageJson,TmpFirmware} from 'uhk-usb';

import { getSmartMacroDocRootPath } from './get-smart-macro-doc-root-path';

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

    await copy(smartMacroDocFirmwarePath, destination);

    logger.misc('[SmartMacroCopy] done');
}

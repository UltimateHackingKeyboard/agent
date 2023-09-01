import { dirname, join } from 'path';
import { FirmwareJson, UhkModule } from 'uhk-common';

import { FirmwareInfo } from '../models/index.js';

export function getModuleFirmwareInfo(module: UhkModule, firmwareJson: FirmwareJson): FirmwareInfo {
    const moduleConfig = firmwareJson.modules.find(firmwareDevice => firmwareDevice.moduleId === module.id);

    if (!moduleConfig) {
        throw new Error(`The firmware does not support: ${module.name}`);
    }

    return {
        checksum: moduleConfig.checksum,
        path: join(dirname(firmwareJson.path), 'modules', `${moduleConfig.name}.bin`)
    };
}

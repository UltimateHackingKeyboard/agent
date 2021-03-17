import { dirname, join } from 'path';
import { FirmwareJson, UhkModule } from 'uhk-common';

export function getModuleFirmwarePath(module: UhkModule, firmwareJson: FirmwareJson): string {
    const moduleConfig = firmwareJson.modules.find(firmwareDevice => firmwareDevice.moduleId === module.id);

    if (!moduleConfig) {
        throw new Error(`The firmware does not support: ${module.name}`);
    }

    return join(dirname(firmwareJson.path), 'modules', `${moduleConfig.name}.bin`);
}

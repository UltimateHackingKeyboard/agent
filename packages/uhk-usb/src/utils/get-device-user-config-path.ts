import { dirname, join } from 'path';
import { FirmwareJson, UhkDeviceProduct } from 'uhk-common';

import { findDeviceConfigInFirmwareJson } from './find-device-config-in-firmware-json.js';

export function getDeviceUserConfigPath(device: UhkDeviceProduct, firmwareJson: FirmwareJson): string {
    const deviceConfig = findDeviceConfigInFirmwareJson(device, firmwareJson);

    return join(dirname(firmwareJson.path), 'devices', deviceConfig.name, 'config.bin');
}

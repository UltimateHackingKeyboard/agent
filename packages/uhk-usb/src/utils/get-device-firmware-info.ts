import { dirname, join } from 'path';
import { FirmwareJson, UhkDeviceProduct } from 'uhk-common';

import { FirmwareInfo } from '../models/index.js';

export function getDeviceFirmwareInfo(device: UhkDeviceProduct, firmwareJson: FirmwareJson): FirmwareInfo {
    const deviceConfig = firmwareJson.devices.find(firmwareDevice => firmwareDevice.deviceId === device.id);

    if (!deviceConfig) {
        throw new Error(`The firmware does not support: ${device.name}`);
    }

    return {
        checksum: deviceConfig.checksum,
        path: join(dirname(firmwareJson.path), 'devices', deviceConfig.name, 'firmware.hex'),
    };
}

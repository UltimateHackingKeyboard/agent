import { dirname, join } from 'path';
import { FirmwareJson, UhkDeviceProduct } from 'uhk-common';

export function getDeviceFirmwarePath(device: UhkDeviceProduct, firmwareJson: FirmwareJson): string {
    const deviceConfig = firmwareJson.devices.find(firmwareDevice => firmwareDevice.deviceId === device.id);

    if (!deviceConfig) {
        throw new Error(`The firmware does not support: ${device.name}`);
    }

    return join(dirname(firmwareJson.path), 'devices', deviceConfig.name, 'firmware.hex');
}

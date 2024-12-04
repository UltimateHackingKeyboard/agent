import { dirname, join } from 'path';
import { FirmwareJson, FIRMWARE_UPGRADE_METHODS, UhkDeviceProduct } from 'uhk-common';

export function getDeviceFirmwarePath(device: UhkDeviceProduct, firmwareJson: FirmwareJson): string {
    const deviceConfig = firmwareJson.devices.find(firmwareDevice => firmwareDevice.deviceId === device.id);

    if (!deviceConfig) {
        throw new Error(`The firmware does not support: ${device.name}`);
    }

    const fileName = device.firmwareUpgradeMethod === FIRMWARE_UPGRADE_METHODS.KBOOT
        ? 'firmware.hex'
        : 'firmware.bin';

    return join(dirname(firmwareJson.path), 'devices', deviceConfig.name, fileName);
}

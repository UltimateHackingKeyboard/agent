import { lt } from 'semver';
import { FirmwareJson, UhkDeviceProduct } from 'uhk-common';

export function checkFirmwareAndDeviceCompatibility(json: FirmwareJson, device: UhkDeviceProduct): void {
    if (device.id === 2 && lt(json.firmwareVersion, '8.10.5')) {
        throw new Error('Only firmware 8.10.5 or greater is supported by the UHK 60 v2.');
    }
}

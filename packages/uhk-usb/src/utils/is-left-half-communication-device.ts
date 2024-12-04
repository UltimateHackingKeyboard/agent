import { Device } from 'node-hid';
import { UHK_80_DEVICE_LEFT } from 'uhk-common';

import { isUhkCommunicationUsage } from '../util.js';

export function isLeftHalfCommunicationDevice(device: Device): boolean {
    return UHK_80_DEVICE_LEFT.keyboard.some(vidPid => {
        return vidPid.vid === device.vendorId
            && vidPid.pid == device.productId
            && isUhkCommunicationUsage(device);
    });
}

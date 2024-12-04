import { Device } from 'node-hid';
import { UHK_80_DEVICE } from 'uhk-common';

import { isUhkCommunicationUsage } from '../util.js';

export function isRightHalfCommunicationDevice(device: Device): boolean {
    return UHK_80_DEVICE.keyboard.some(vidPid => {
        return vidPid.vid === device.vendorId
            && vidPid.pid == device.productId
            && isUhkCommunicationUsage(device);
    });
}

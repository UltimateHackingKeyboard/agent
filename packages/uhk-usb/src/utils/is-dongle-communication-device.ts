import { Device } from 'node-hid';
import { UHK_DONGLE } from 'uhk-common';

import { isUhkCommunicationUsage } from '../util.js';

export function isDongleCommunicationDevice(device: Device): boolean {
    return UHK_DONGLE.keyboard.some(vidPid => {
        return vidPid.vid === device.vendorId
            && vidPid.pid == device.productId
            && isUhkCommunicationUsage(device);
    });
}

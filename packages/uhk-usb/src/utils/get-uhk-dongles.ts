import { Device, devices } from 'node-hid';
import { UHK_DONGLE } from 'uhk-common';

import { isUhkCommunicationUsage } from '../util.js';

export function getUhkDongles(): Array<Device> {
    return devices().filter(x => UHK_DONGLE.keyboard.some(vidPid => x.vendorId === vidPid.vid && x.productId === vidPid.pid && isUhkCommunicationUsage(x)));
}

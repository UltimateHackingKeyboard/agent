import { devices as HidDevices } from 'node-hid';
import { UhkDeviceProduct } from 'uhk-common';

import { isUhkCommunicationUsage } from '../util.js';

export async function isUkhKeyboardConnected(uhkDevice: UhkDeviceProduct): Promise<boolean> {
    const hidDevices = HidDevices();

    for (const device of hidDevices) {
        if (uhkDevice.keyboard.some(vidPid => vidPid.vid === device.vendorId && vidPid.pid === device.productId)
            && isUhkCommunicationUsage(device)
        ) {
            return true;
        }
    }

    return false;
}

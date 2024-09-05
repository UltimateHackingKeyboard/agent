import { devices } from 'node-hid';
import { UHK_DEVICES, UhkDeviceProduct } from 'uhk-common';

import { validateConnectedDevices } from './validate-connected-devices.js';

export function getCurrentUhkDeviceProduct(): UhkDeviceProduct | undefined {
    validateConnectedDevices();

    const hidDevices = devices();

    for (const hidDevice of hidDevices) {
        for (const uhkDevice of UHK_DEVICES) {
            if (uhkDevice.bootloader.some(vidPid => vidPid.vid === hidDevice.vendorId && vidPid.pid === hidDevice.productId) ||
                uhkDevice.keyboard.some(vidPid => vidPid.vid === hidDevice.vendorId && vidPid.pid === hidDevice.productId)
            ) {
                return uhkDevice;
            }
        }
    }
}

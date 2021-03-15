import { devices } from 'node-hid';
import { UHK_DEVICES, UhkDeviceProduct } from 'uhk-common';

import { validateConnectedDevices } from './validate-connected-devices';

export function getCurrentUhkDeviceProduct(): UhkDeviceProduct | undefined {
    validateConnectedDevices();

    // TODO: pass vendor id ????
    const hidDevices = devices();

    for (const hidDevice of hidDevices) {
        for (const uhkDevice of UHK_DEVICES) {
            if (hidDevice.vendorId === uhkDevice.vendorId
                && (hidDevice.productId === uhkDevice.keyboardPid || hidDevice.productId === uhkDevice.bootloaderPid)) {
                return uhkDevice;
            }
        }
    }
}

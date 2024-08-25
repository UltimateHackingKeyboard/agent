import { devicesAsync } from 'node-hid';
import { UHK_DEVICES, UhkDeviceProduct } from 'uhk-common';

import { validateConnectedDevices } from './validate-connected-devices.js';

export async function getCurrentUhkDeviceProduct(): Promise<UhkDeviceProduct | undefined> {
    await validateConnectedDevices();

    const hidDevices = await devicesAsync();

    for (const hidDevice of hidDevices) {
        for (const uhkDevice of UHK_DEVICES) {
            if (hidDevice.vendorId === uhkDevice.vendorId
                && (hidDevice.productId === uhkDevice.keyboardPid || hidDevice.productId === uhkDevice.bootloaderPid)) {
                return uhkDevice;
            }
        }
    }
}

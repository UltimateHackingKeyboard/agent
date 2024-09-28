import { devicesAsync } from 'node-hid';
import { UHK_DEVICES, UhkDeviceProduct } from 'uhk-common';

import { validateConnectedDevices } from './validate-connected-devices.js';

export async function getCurrentUhkDeviceProductByBootloaderId(): Promise<UhkDeviceProduct | undefined> {
    await validateConnectedDevices();

    const hidDevices = await devicesAsync();

    for (const hidDevice of hidDevices) {
        for (const uhkDevice of UHK_DEVICES) {
            if (uhkDevice.bootloader.some(vidPid => vidPid.vid === hidDevice.vendorId && vidPid.pid === hidDevice.productId)) {
                return uhkDevice;
            }
        }
    }
}

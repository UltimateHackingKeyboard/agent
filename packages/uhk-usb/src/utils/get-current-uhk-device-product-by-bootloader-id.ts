import { devices } from 'node-hid';
import { UHK_DEVICES, UhkDeviceProduct } from 'uhk-common';

export function getCurrentUhkDeviceProductByBootloaderId(): UhkDeviceProduct | undefined {
    const hidDevices = devices();

    for (const hidDevice of hidDevices) {
        for (const uhkDevice of UHK_DEVICES) {
            if (hidDevice.vendorId === uhkDevice.vid && hidDevice.productId === uhkDevice.bootloaderId) {
                return uhkDevice;
            }
        }
    }
}

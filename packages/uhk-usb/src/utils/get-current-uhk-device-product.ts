import { devices } from 'node-hid';
import { ALL_UHK_DEVICES, DeviceIdentifier, UHK_DEVICES, UhkDeviceProduct } from 'uhk-common';

import { isUhkCommunicationInterface } from '../util.js';
import { deviceVidPidInterfaceFilter } from './device-vid-pid-interface-filter.js';
import { validateConnectedDevices } from './validate-connected-devices.js';

export function getCurrentUhkDeviceProduct(deviceIdentifier: DeviceIdentifier = {}): UhkDeviceProduct | undefined {
    validateConnectedDevices(deviceIdentifier);
    const isVidPidInterfaceMatching = deviceVidPidInterfaceFilter(deviceIdentifier);

    const hidDevices = devices();

    for (const hidDevice of hidDevices) {
        if (deviceIdentifier['serial-number']) {
            if (deviceIdentifier['serial-number'] === hidDevice.serialNumber
                && ((deviceIdentifier.vid && isVidPidInterfaceMatching(hidDevice))
                    || (!deviceIdentifier.vid && isUhkCommunicationInterface(hidDevice))
                )
            ) {
                return ALL_UHK_DEVICES.find(uhkDevice => {
                    return uhkDevice.bootloader.some(vidPid => vidPid.vid === hidDevice.vendorId && vidPid.pid === hidDevice.productId) ||
                        uhkDevice.keyboard.some(vidPid => vidPid.vid === hidDevice.vendorId && vidPid.pid === hidDevice.productId);
                });
            }
            else {
                continue;
            }
        }

        if (deviceIdentifier.vid && isVidPidInterfaceMatching(hidDevice)) {
            return ALL_UHK_DEVICES.find(uhkDevice => {
                return uhkDevice.bootloader.some(vidPid => vidPid.vid === hidDevice.vendorId && vidPid.pid === hidDevice.productId) ||
                        uhkDevice.keyboard.some(vidPid => vidPid.vid === hidDevice.vendorId && vidPid.pid === hidDevice.productId);
            });
        }

        for (const uhkDevice of UHK_DEVICES) {
            if (uhkDevice.bootloader.some(vidPid => vidPid.vid === hidDevice.vendorId && vidPid.pid === hidDevice.productId) ||
                uhkDevice.keyboard.some(vidPid => vidPid.vid === hidDevice.vendorId && vidPid.pid === hidDevice.productId)
            ) {
                return uhkDevice;
            }
        }
    }
}

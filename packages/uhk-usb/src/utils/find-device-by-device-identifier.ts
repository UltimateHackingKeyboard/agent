import { Device } from 'node-hid';
import { DeviceIdentifier } from 'uhk-common';

import { isUhkCommunicationInterface } from '../util.js';
import { deviceVidPidInterfaceFilter } from './device-vid-pid-interface-filter.js';

export function findDeviceByDeviceIdentifier(deviceIdentifier: DeviceIdentifier): (device: Device) => boolean {
    const isVidPidInterfaceMatching = deviceVidPidInterfaceFilter(deviceIdentifier);

    return (device: Device) => {
        if (deviceIdentifier['serial-number']) {
            if (device.serialNumber === deviceIdentifier['serial-number']) {
                return (deviceIdentifier.vid && isVidPidInterfaceMatching(device))
                    || (!deviceIdentifier.vid && isUhkCommunicationInterface(device));
            } else {
                return false;
            }
        }

        return isVidPidInterfaceMatching(device);
    };
}

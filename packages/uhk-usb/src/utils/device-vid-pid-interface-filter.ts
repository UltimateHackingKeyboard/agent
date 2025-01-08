import { Device } from 'node-hid';
import { DeviceIdentifier } from 'uhk-common';

import { isUhkCommunicationUsage } from '../util.js';

export function deviceVidPidInterfaceFilter(deviceIdentifier: DeviceIdentifier): (device: Device) => boolean  {
    const isInterfaceProvided = deviceIdentifier['usb-interface'] !== null && deviceIdentifier['usb-interface'] !== undefined;

    return (device: Device): boolean => {
        return device.vendorId === deviceIdentifier.vid
            && device.productId === deviceIdentifier.pid
            && ((isInterfaceProvided && device.interface === deviceIdentifier['usb-interface'])
                || (!isInterfaceProvided && isUhkCommunicationUsage(device))
            );
    };
}

import {
    CANT_FIND_CONNECTED_DEVICE_ERROR_MESSAGE,
    getUhkDevices,
    isUhkCommunicationInterface,
    MULTIPLE_DEVICE_CONNECTED_ERROR_MESSAGE,
    UHK_HID_DEVICE_NOT_CONNECTED,
} from 'uhk-usb';

import { InvalidArgumentError } from './invalid-argument-error.js';

export function errorHandler(error) {
    if (error instanceof InvalidArgumentError) {
        console.error(error.message);
    }
    if (error.message === MULTIPLE_DEVICE_CONNECTED_ERROR_MESSAGE ||
        error.message === CANT_FIND_CONNECTED_DEVICE_ERROR_MESSAGE ||
        error.message === UHK_HID_DEVICE_NOT_CONNECTED) {
        console.error(error.message);

        console.log('Available UHK devices:');
        const devices = getUhkDevices();
        for(const device of devices) {
            if (isUhkCommunicationInterface(device)) {
                const selector = device.serialNumber
                    ? `--serial-number=${device.serialNumber}`
                    : `--vid=${device.vendorId} --pid=${device.productId} --usb-interface=${device.interface}`;

                console.log(`vid: ${device.vendorId} pid: ${device.productId} interface: ${device.interface} serial number: ${device.serialNumber} selector: ${selector}`);
            }
        }
    }
    else {
        console.error(error);
    }

    process.exit(1);
}

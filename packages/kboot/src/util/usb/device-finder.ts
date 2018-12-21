import { isNullOrUndefined } from 'util';
import { Device } from 'node-hid';

import { USB } from '../../models';

export const deviceFinder = (usb: USB) => {
    return (device: Device): boolean => {
        if (device.productId !== usb.productId) {
            return false;
        }

        if (device.vendorId !== usb.vendorId) {
            return false;
        }
        // TODO: Add interface, usage and usePage filtering
        // if (!isNullOrUndefined(usb.interface) && device.interface !== -1 && device.interface === usb.interface) {
        //     return true;
        // }

        return true;
    };
};

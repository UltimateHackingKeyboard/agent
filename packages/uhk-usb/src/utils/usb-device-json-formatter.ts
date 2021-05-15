import { toHexString } from 'uhk-common';

export function usbDeviceJsonFormatter(key: any, value: any): any {
    switch (key) {
        case 'vendorId':
        case 'productId':
        case 'keyboardPid':
        case 'bootloaderPid':
        case 'buspalPid':
            return toHexString(value);

        default:
            return value;
    }

}

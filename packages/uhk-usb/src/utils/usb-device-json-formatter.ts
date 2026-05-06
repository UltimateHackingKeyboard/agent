import { toHexString } from 'uhk-common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function usbDeviceJsonFormatter(key: any, value: any): any {
    if (value === undefined || value === null) {
        return value
    }

    switch (key) {
        case 'vendorId':
        case 'productId':
        case 'keyboardPid':
        case 'bootloaderPid':
        case 'buspalPid':
        case 'i2cAddress':
            return toHexString(value);

        default:
            return value;
    }

}

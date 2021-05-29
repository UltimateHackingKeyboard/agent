import { toHexString } from 'uhk-common';

export function usbDeviceJsonFormatter(key: any, value: any): any {
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

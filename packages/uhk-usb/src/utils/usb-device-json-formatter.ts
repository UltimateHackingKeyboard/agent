import { toHexString } from 'uhk-common';

export function usbDeviceJsonFormatter(key: string, value: number | undefined | null): string | number | undefined | null {
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

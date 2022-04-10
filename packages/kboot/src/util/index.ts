export * from './encode-string-to-parameters.js';
export * from './response-parser.js';
export * from './usb/index.js';
export * from './snooze.js';

export const convertToHexString = (arr: number[] | Buffer): string => {
    let str = '';

    for (const n of arr) {
        let hex = n.toString(16);
        if (hex.length < 2) {
            hex = '0' + hex;
        }

        if (str.length > 0) {
            str += ' ';
        }

        str += hex;
    }

    return str;
};

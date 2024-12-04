import { convertArrayToHexString } from 'uhk-common';

export interface PairingInfo {
    address: number[];
    c: number[];
    r: number[];
}

export function serialisePairingInfo(data: PairingInfo) {
    return JSON.stringify({
        address: convertArrayToHexString(data.address),
        r: convertArrayToHexString(data.r),
        c: convertArrayToHexString(data.c),
    });
}

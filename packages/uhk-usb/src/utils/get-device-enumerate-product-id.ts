import { UhkDeviceProduct } from 'uhk-common';

import { EnumerationModes } from '../constants';

export function getDeviceEnumerateProductId(device: UhkDeviceProduct, enumerationMode: EnumerationModes): number {
    switch (enumerationMode) {
        case EnumerationModes.Bootloader:
            return device.bootloaderPid;

        case EnumerationModes.Buspal:
            return device.buspalPid;

        case EnumerationModes.NormalKeyboard:
            return device.keyboardPid;

        default:
            throw new Error(`Not implemented enumeration device mapping: ${enumerationMode}`);
    }
}

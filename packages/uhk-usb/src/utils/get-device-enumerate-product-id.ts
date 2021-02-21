import { UhkDeviceProduct } from 'uhk-common';

import { EnumerationModes } from '../constants';

export function getDeviceEnumerateProductId(device: UhkDeviceProduct, enumerationMode: EnumerationModes): number {
    switch (enumerationMode) {
        case EnumerationModes.Bootloader:
            return device.bootloaderId;

        case EnumerationModes.Buspal:
            return device.buspal;

        case EnumerationModes.NormalKeyboard:
            return device.normalKeyboard;

        default:
            throw new Error(`Not implemented enumeration device mapping: ${enumerationMode}`);
    }
}

import { UhkDeviceProduct, VidPidPair } from 'uhk-common';

import { EnumerationModes } from '../constants.js';

export function getDeviceEnumerateVidPidPairs(device: UhkDeviceProduct, enumerationMode: EnumerationModes): VidPidPair[] {
    switch (enumerationMode) {
        case EnumerationModes.Bootloader:
            return device.bootloader;

        case EnumerationModes.Buspal:
            return device.buspal;

        case EnumerationModes.NormalKeyboard:
            return device.keyboard;

        default:
            throw new Error(`Not implemented enumeration device mapping: ${enumerationMode}`);
    }
}

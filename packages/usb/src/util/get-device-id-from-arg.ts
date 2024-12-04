import {
    UHK_60_DEVICE,
    UHK_60_V2_DEVICE,
    UHK_80_DEVICE,
} from 'uhk-common';

import { InvalidArgumentError } from '../invalid-argument-error.js';

const DEVICES = new Map<string, number>([
    ['uhk60v1', UHK_60_DEVICE.id],
    ['uhk60v2', UHK_60_V2_DEVICE.id],
    ['uhk80', UHK_80_DEVICE.id],
]);

function getKeys(): string {
    return Array.from(DEVICES.keys()).join('|');
}

export function getDeviceIdFromArg(device: string): number {
    if (DEVICES.has(device)) {
        return DEVICES.get(device);
    }

    throw new InvalidArgumentError(`Invalid deviceId. DeviceId should be either {${getKeys()}}`);
}

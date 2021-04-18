import { InvalidArgumentError } from '../invalid-argument-error';

const DEVICES = new Map<string, number>([
    ['uhk60v1', 1],
    ['uhk60v2', 2]
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

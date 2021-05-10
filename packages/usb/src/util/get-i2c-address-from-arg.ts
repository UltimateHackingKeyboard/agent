import { ModuleSlotToI2cAddress } from 'uhk-common';

import { InvalidArgumentError } from '../invalid-argument-error';

export function getI2cAddressArgs(): string {
    return Object.keys(ModuleSlotToI2cAddress)
        .filter(key => isNaN(parseInt(key)))
        .join(', ');
}

export function getI2cAddressFromArg(arg: string): ModuleSlotToI2cAddress {
    const i2cAddress = ModuleSlotToI2cAddress[arg];

    if (i2cAddress) {
        return i2cAddress;
    }

    throw new InvalidArgumentError(`Invalid deviceId. DeviceId should be either {${getI2cAddressArgs()}}`);
}

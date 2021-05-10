import { ModuleSlotToI2cAddress, toHexString } from 'uhk-common';

import { InvalidArgumentError } from '../invalid-argument-error';

function getKeys(): string {
    return Object.keys(ModuleSlotToI2cAddress)
        .map(key => {
            const nun = parseInt(key);

            return isNaN(nun) ? key : toHexString(nun);
        })
        .join(', ');
}

export function getI2cAddressFromArg(arg: string): ModuleSlotToI2cAddress {
    const i2cAddress = ModuleSlotToI2cAddress[arg];

    if (i2cAddress) {
        return i2cAddress;
    }

    throw new InvalidArgumentError(`Invalid deviceId. DeviceId should be either {${getKeys()}}`);
}

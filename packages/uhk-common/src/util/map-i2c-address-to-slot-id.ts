import { ModuleSlotToI2cAddress, ModuleSlotToId } from '../models';
import { toHexString } from './to-hex-string';

export function mapI2cAddressToSlotId(address: ModuleSlotToI2cAddress): ModuleSlotToId {
    switch (address) {
        case ModuleSlotToI2cAddress.leftHalf:
            return ModuleSlotToId.leftHalf;

        case ModuleSlotToI2cAddress.leftIqs5xx:
            return ModuleSlotToId.leftModule;

        case ModuleSlotToI2cAddress.leftModule:
            return ModuleSlotToId.leftModule;

        case ModuleSlotToI2cAddress.rightIqs5xx:
            return ModuleSlotToId.rightModule;

        case ModuleSlotToI2cAddress.rightModule:
            return ModuleSlotToId.rightModule;

        default:
            throw new Error(`Can't map I2C Address: ${toHexString(address as number)} to module slot ID!`);
    }
}

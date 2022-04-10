import { ModuleSlotToI2cAddress } from '../models/module-slot-to-i2c-adress.js';

export function mapI2cAddressToModuleName(address: ModuleSlotToI2cAddress): string {
    switch (address) {
        case ModuleSlotToI2cAddress.leftHalf:
            return 'leftHalf';

        case ModuleSlotToI2cAddress.leftTouchpad:
            return 'leftTouchpad';

        case ModuleSlotToI2cAddress.leftModule:
            return 'leftModule';

        case ModuleSlotToI2cAddress.rightTouchpad:
            return 'rightTouchpad';

        case ModuleSlotToI2cAddress.rightModule:
            return 'rightModule';

        default:
            return 'Unknown';
    }
}

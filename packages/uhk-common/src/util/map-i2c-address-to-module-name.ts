import { ModuleSlotToI2cAddress } from '../models';

export function mapI2cAddressToModuleName(address: ModuleSlotToI2cAddress): string {
    switch (address) {
        case ModuleSlotToI2cAddress.leftHalf:
            return 'leftHalf';

        case ModuleSlotToI2cAddress.leftIqs5xx:
            return 'leftTouchpad';

        case ModuleSlotToI2cAddress.leftModule:
            return 'leftModule';

        case ModuleSlotToI2cAddress.rightIqs5xx:
            return 'rightTouchpad';

        case ModuleSlotToI2cAddress.rightModule:
            return 'rightModule';

        default:
            return 'Unknown';
    }
}

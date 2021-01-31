import { LeftSlotModules } from './left-slot-modules';
import { RightSlotModules } from './right-slot-modules';

export interface HalvesInfo {
    areHalvesMerged: boolean;
    leftModuleSlot: LeftSlotModules;
    isLeftHalfConnected: boolean;
    rightModuleSlot: RightSlotModules;
}

export function getDefaultHalvesInfo(): HalvesInfo {
    return {
        isLeftHalfConnected: true,
        leftModuleSlot: LeftSlotModules.KeyClusterLeft,
        areHalvesMerged: false,
        rightModuleSlot: RightSlotModules.TrackballRight
    };
}

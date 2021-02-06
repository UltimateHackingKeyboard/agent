import { runInElectron } from '../util';

import { LeftSlotModules } from './left-slot-modules';
import { RightSlotModules } from './right-slot-modules';

export interface HalvesInfo {
    areHalvesMerged: boolean;
    leftModuleSlot: LeftSlotModules;
    isLeftHalfConnected: boolean;
    rightModuleSlot: RightSlotModules;
}

export function getDefaultHalvesInfo(): HalvesInfo {
    if (runInElectron()) {
        return {
            isLeftHalfConnected: true,
            leftModuleSlot: LeftSlotModules.NoModule,
            areHalvesMerged: false,
            rightModuleSlot: RightSlotModules.NoModule
        };
    }

    return {
        isLeftHalfConnected: true,
        leftModuleSlot: LeftSlotModules.KeyClusterLeft,
        areHalvesMerged: false,
        rightModuleSlot: RightSlotModules.TrackpointRight
    };
}

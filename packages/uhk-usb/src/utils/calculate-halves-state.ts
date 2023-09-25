import {HalvesInfo, LeftSlotModules, RightSlotModules} from "uhk-common";

import {DeviceState} from "../models/index.js";

export function calculateHalvesState(deviceState: DeviceState): HalvesInfo {
    return {
        areHalvesMerged: deviceState.areHalvesMerged,
        isLeftHalfConnected: deviceState.isLeftHalfConnected,
        leftModuleSlot: LeftSlotModules[deviceState.leftModuleSlot],
        rightModuleSlot: RightSlotModules[deviceState.rightModuleSlot]
    };
}

import {enumFromString, HalvesInfo, LeftSlotModules, RightSlotModules} from "uhk-common";

import {DeviceState} from "../models/index.js";

export function calculateHalvesState(deviceState: DeviceState): HalvesInfo {
    return {
        areHalvesMerged: deviceState.areHalvesMerged,
        isLeftHalfConnected: deviceState.isLeftHalfConnected,
        leftModuleSlot: enumFromString(LeftSlotModules, deviceState.leftModuleSlot),
        rightModuleSlot: enumFromString(RightSlotModules, deviceState.rightModuleSlot)
    };
}

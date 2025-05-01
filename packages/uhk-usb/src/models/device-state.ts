export interface DeviceState {
    isEepromBusy: boolean;
    isMacroStatusDirty: boolean;
    isZephyrLogAvailable: boolean;
    areHalvesMerged: boolean;
    isLeftHalfConnected: boolean;
    activeLayerNumber: number;
    activeLayerName: string;
    activeLayerToggled: boolean;
    leftKeyboardHalfSlot: string;
    leftModuleSlot: string;
    newPairedDevice: boolean;
    rightModuleSlot: string;
}

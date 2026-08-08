export interface DeviceState {
    isEepromBusy: boolean;
    isMacroStatusDirty: boolean;
    isModuleFlashBusy: boolean;
    isZephyrLogAvailable: boolean;
    areHalvesMerged: boolean;
    isLeftHalfConnected: boolean;
    activeKeymapIndex: number;
    activeLayerNumber: number;
    activeLayerName: string;
    activeLayerToggled: boolean;
    leftKeyboardHalfSlot: string;
    leftModuleSlot: string;
    newPairedDevice: boolean;
    rightModuleSlot: string;
}

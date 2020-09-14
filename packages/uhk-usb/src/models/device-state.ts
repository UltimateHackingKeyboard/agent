export interface DeviceState {
    isEepromBusy: boolean;
    areHalvesMerged: boolean;
    isLeftHalfConnected: boolean;
    activeLayerNumber: number;
    activeLayerName: string;
    activeLayerToggled: boolean;
    leftKeyboardHalfSlot: string;
    leftModuleSlot: string;
    rightModuleSlot: string;
}

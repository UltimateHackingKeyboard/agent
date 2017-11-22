export namespace Constants {
    export const VENDOR_ID = 0x1D50;
    export const PRODUCT_ID = 0x6122;
    export const MAX_PAYLOAD_SIZE = 64;
}

/**
 * UHK USB Communications command. All communication package should have start with a command code.
 */
export enum UsbCommand {
    GetProperty = 0,
    Reenumerate = 1,
    UploadUserConfig = 8,
    ApplyConfig = 9,
    LaunchEepromTransfer = 12,
    ReadHardwareConfig = 13,
    WriteHardwareConfig = 14,
    ReadUserConfig = 15,
    GetKeyboardState = 16,
    JumpToModuleBootloader = 18,
    SendKbootCommandToModule = 19
}

export enum EepromTransfer {
    ReadHardwareConfig = 0,
    WriteHardwareConfig = 1,
    ReadUserConfig = 2,
    WriteUserConfig = 3
}

export enum SystemPropertyIds {
    UsbProtocolVersion = 0,
    BridgeProtocolVersion = 1,
    DataModelVersion = 2,
    FirmwareVersion = 3,
    HardwareConfigSize = 4,
    MaxUserConfigSize = 5
}

export enum EnumerationModes {
    Bootloader = 0,
    Buspal = 1,
    NormalKeyboard = 2,
    CompatibleKeyboard = 3
}

export const enumerationModeIdToProductId = {
    '0': 0x6120,
    '1': 0x6121,
    '2': 0x6122,
    '3': 0x6123
};

export enum EnumerationNameToProductId {
    bootloader = 0x6120,
    buspal = 0x6121,
    normalKeyboard = 0x6122,
    compatibleKeyboard = 0x6123
}

export enum ModuleSlotToI2cAddress {
    leftHalf = '0x10',
    leftAddon = '0x20',
    rightAddon = '0x30'
}

export enum ModuleSlotToId {
    leftHalf = 1,
    leftAddon = 2,
    rightAddon = 3
}

export enum KbootCommands {
    idle = 0,
    ping = 1,
    reset = 2
}

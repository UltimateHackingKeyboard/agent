export namespace Constants {
    export const VENDOR_ID = 0x1D50;
    export const PRODUCT_ID = 0x6122;
    export const MAX_PAYLOAD_SIZE = 64;
}

/**
 * UHK USB Communications command. All communication package should have start with a command code.
 */
export enum UsbCommand {
    GetProperty              = 0x00,
    Reenumerate              = 0x01,
    JumpToModuleBootloader   = 0x02,
    SendKbootCommandToModule = 0x03,
    ReadConfig               = 0x04,
    WriteHardwareConfig      = 0x05,
    WriteStagingUserConfig   = 0x06,
    ApplyConfig              = 0x07,
    LaunchEepromTransfer     = 0x08,
    GetDeviceState           = 0x09,
    SetTestLed               = 0x0a,
    GetDebugBuffer           = 0x0b,
    GetAdcValue              = 0x0c,
    SetLedPwmBrightness      = 0x0d
}

export enum EepromOperation {
    read = 0,
    write = 1
}

export enum ConfigBufferId {
    hardwareConfig = 0,
    stagingUserConfig = 1,
    validatedUserConfig = 2
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

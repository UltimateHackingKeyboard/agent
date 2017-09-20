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
    UploadConfig = 8,
    ApplyConfig = 9,
    LaunchEepromTransfer = 12,
    ReadUserConfig = 15,
    GetKeyboardState = 16
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
    UserConfigSize = 5
}

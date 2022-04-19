export namespace Constants {
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
    SetLedPwmBrightness      = 0x0d,
    GetModuleProperty        = 0x0e,
    GetSlaveI2cErrors        = 0x0f,
    SetI2cBaudRate           = 0x10,
    SwitchKeymap             = 0x11,
    GetVariable              = 0x12,
    SetVariable              = 0x13
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

export enum DevicePropertyIds {
    DeviceProtocolVersion = 0,
    ProtocolVersions = 1,
    ConfigSizes = 2,
    CurrentKbootCommand = 3,
    I2cBaudRate= 4,
    Uptime = 5,
    GitTag = 6,
    GitRepo = 7
}

export enum EnumerationModes {
    Bootloader = 0,
    Buspal = 1,
    NormalKeyboard = 2,
    CompatibleKeyboard = 3
}

export enum KbootCommands {
    idle = 0,
    ping = 1,
    reset = 2
}

export enum ModulePropertyId {
    protocolVersions = 0,
    GitTag = 1,
    GitRepo = 2
}

export enum UsbVariables {
    testSwitches = 0,
    testUsbStack = 1,
    debounceTimePress = 2,
    debounceTimeRelease = 3,
    usbReportSemaphore= 4
}

export const LAYER_NUMBER_TO_STRING = [
    'base',
    'mod',
    'fn',
    'mouse'
];

export const MODULE_ID_TO_STRING = [
    'NoModule',
    'LeftKeyboardHalf',
    'KeyClusterLeft',
    'TrackballRight',
    'TrackpointRight',
    'TouchpadRight'
];

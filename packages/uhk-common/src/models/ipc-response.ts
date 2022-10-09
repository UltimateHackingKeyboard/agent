import { HardwareModules } from './hardware-modules.js';

export class IpcResponse {
    success: boolean;
    error?: { message: string };
}

export enum FirmwareUpgradeFailReason {
    UserConfigVersionNotSupported = 'UserConfigVersionNotSupported'
}

export class FirmwareUpgradeIpcResponse extends IpcResponse {
    modules?: HardwareModules;
    failReason?: FirmwareUpgradeFailReason;
}

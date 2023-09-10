import { DeviceModuleRecord } from './device-module-record.js';
import { FirmwareRepoInfo } from './firmware-repo-info.js';
import { FirmwareVersionInfo } from './firmware-version-info.js';

export interface RightModuleInfo extends FirmwareRepoInfo, FirmwareVersionInfo {
    deviceProtocolVersion?: string;
    hardwareConfigVersion?: string;
    moduleProtocolVersion?: string;
    modules: DeviceModuleRecord;
    userConfigVersion?: string;
    smartMacrosVersion?: string;
}

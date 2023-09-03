import { FirmwareRepoInfo } from './firmware-repo-info.js';
import { FirmwareVersionInfo } from './firmware-version-info.js';

export interface RightModuleInfo extends FirmwareRepoInfo, FirmwareVersionInfo {
    deviceProtocolVersion?: string;
    hardwareConfigVersion?: string;
    moduleProtocolVersion?: string;
    userConfigVersion?: string;
    smartMacrosVersion?: string;
}

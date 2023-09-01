import { FirmwareRepoInfo } from './firmware-repo-info.js';

export interface RightModuleInfo extends FirmwareRepoInfo {
    deviceProtocolVersion?: string;
    hardwareConfigVersion?: string;
    firmwareChecksum?: string;
    firmwareVersion?: string;
    moduleProtocolVersion?: string;
    userConfigVersion?: string;
    smartMacrosVersion?: string;
}

import { FirmwareRepoInfo } from './firmware-repo-info.js';

export interface ModuleVersionInfo extends FirmwareRepoInfo {
    firmwareChecksum?: string;
    firmwareVersion?: string;
    moduleProtocolVersion?: string;
}

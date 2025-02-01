import { FirmwareRepoInfo } from './firmware-repo-info.js';
import { FirmwareVersion } from './firmware-version.js';

export interface ModuleVersionInfo extends FirmwareRepoInfo, FirmwareVersion {
    moduleProtocolVersion?: string;
    remoteFirmwareChecksum?: string;
}

import { FirmwareRepoInfo } from './firmware-repo-info.js';
import { FirmwareVersionInfo } from './firmware-version-info.js';

export interface ModuleVersionInfo extends FirmwareRepoInfo, FirmwareVersionInfo {
    moduleProtocolVersion?: string;
}

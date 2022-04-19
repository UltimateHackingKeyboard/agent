import { FirmwareRepoInfo } from './firmware-repo-info.js';

export interface ModuleVersionInfo extends FirmwareRepoInfo {
    firmwareVersion?: string;
    moduleProtocolVersion?: string;
}

import { FirmwareRepoInfo } from './firmware-repo-info.js';
import { FirmwareVersion } from './firmware-version.js';
import { ProtocolVersions } from './protocol-versions.js';

export interface DeviceVersionInformation extends FirmwareRepoInfo, FirmwareVersion, ProtocolVersions {
    builtFirmwareChecksum?: string;
}

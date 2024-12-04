import { FirmwareRepoInfo } from './firmware-repo-info.js';
import { FirmwareVersionInfo } from './firmware-version-info.js';
import { ProtocolVersions } from './protocol-versions.js';

export interface DeviceVersionInformation extends FirmwareRepoInfo, FirmwareVersionInfo, ProtocolVersions {
}

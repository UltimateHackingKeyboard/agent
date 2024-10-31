import { DeviceModuleRecord } from './device-module-record.js';
import { FirmwareRepoInfo } from './firmware-repo-info.js';
import { FirmwareVersionInfo } from './firmware-version-info.js';
import { ProtocolVersions } from './protocol-versions.js';

export interface RightModuleInfo extends FirmwareRepoInfo, FirmwareVersionInfo, ProtocolVersions {
    modules: DeviceModuleRecord;
}

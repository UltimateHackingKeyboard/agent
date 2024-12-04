import { FirmwareVersion } from './firmware-version.js';

export interface ProtocolVersions extends FirmwareVersion {
    deviceProtocolVersion?: string;
    hardwareConfigVersion?: string;
    moduleProtocolVersion?: string;
    userConfigVersion?: string;
    smartMacrosVersion?: string;
}

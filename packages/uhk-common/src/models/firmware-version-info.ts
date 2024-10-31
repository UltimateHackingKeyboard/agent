import { FirmwareVersion } from './firmware-version.js';

export interface FirmwareVersionInfo extends FirmwareVersion {
    firmwareChecksum?: string;
}

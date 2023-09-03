import { FirmwareVersionInfo } from '../models/index.js';

export function isSameFirmware(a: FirmwareVersionInfo, b: FirmwareVersionInfo) {
    if (!a || !b) {
        return false;
    }

    if (a.firmwareChecksum && b.firmwareChecksum) {
        return a.firmwareChecksum === b.firmwareChecksum;
    }

    return a.firmwareVersion === b.firmwareVersion;
}

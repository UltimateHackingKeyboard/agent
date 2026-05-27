import { isVersionGteV1CanUndefined } from './version-helpers.js';

const DEVICE_PROTOCOL_VERSION_THAT_SUPPORT_STATUS_ERROR = '4.10.0';

export function isDeviceProtocolSupportStatusError (deviceProtocolVersion: string): boolean {
    return isVersionGteV1CanUndefined(deviceProtocolVersion, DEVICE_PROTOCOL_VERSION_THAT_SUPPORT_STATUS_ERROR);
}

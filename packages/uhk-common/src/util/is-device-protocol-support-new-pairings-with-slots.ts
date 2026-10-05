import { isVersionGte } from './version-helpers.js';

const DEVICE_PROTOCOL_VERSION_THAT_SUPPORT_NEW_PAIRINGS_WITH_SLOTS = '4.19.0';

export function isDeviceProtocolSupportNewPairingsWithSlots (deviceProtocolVersion: string): boolean {
    return isVersionGte(deviceProtocolVersion, DEVICE_PROTOCOL_VERSION_THAT_SUPPORT_NEW_PAIRINGS_WITH_SLOTS);
}

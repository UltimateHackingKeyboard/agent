import { isVersionGteV1CanUndefined } from './version-helpers.js';

const DEVICE_PROTOCOL_VERSION_THAT_SUPPORT_ACTIVE_KEYMAP_INDEX = '4.10.0';

export function isDeviceProtocolSupportActiveKeymapIndex(deviceProtocolVersion: string): boolean {
    return isVersionGteV1CanUndefined(deviceProtocolVersion, DEVICE_PROTOCOL_VERSION_THAT_SUPPORT_ACTIVE_KEYMAP_INDEX);
}

import { UhkBuffer } from '../config-serializer/uhk-buffer.js';

/**
 * Reads user-config version from a binary buffer without advancing the caller's offset permanently.
 */
export function readUserConfigurationVersionFromBinary(buffer: UhkBuffer): string {
    const offset = buffer.offset;
    const userConfigMajorVersion = buffer.readUInt16();
    const userConfigMinorVersion = buffer.readUInt16();
    const userConfigPatchVersion = buffer.readUInt16();
    buffer.offset = offset;

    return `${userConfigMajorVersion}.${userConfigMinorVersion}.${userConfigPatchVersion}`;
}

/**
 * Reads user-config version from a JSON object without fully deserializing it.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function readUserConfigurationVersionFromJsonObject(jsonObject: any): string | undefined {
    if (jsonObject?.userConfigMajorVersion == null
        || jsonObject?.userConfigMinorVersion == null
        || jsonObject?.userConfigPatchVersion == null) {
        return undefined;
    }

    return `${jsonObject.userConfigMajorVersion}.${jsonObject.userConfigMinorVersion}.${jsonObject.userConfigPatchVersion}`;
}

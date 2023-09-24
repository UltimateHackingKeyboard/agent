import semver from 'semver';

const DEVICE_PROTOCOL_VERSION_THAT_SUPPORT_STATUS_ERROR = '4.10.0';

export function isDeviceProtocolSupportStatusError (deviceProtocolVersion: string): boolean {
    if (!deviceProtocolVersion)
        return false;

    return semver.gte(deviceProtocolVersion, DEVICE_PROTOCOL_VERSION_THAT_SUPPORT_STATUS_ERROR);
}

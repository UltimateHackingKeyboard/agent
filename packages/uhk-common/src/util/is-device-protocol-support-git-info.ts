import semver from 'semver';

const DEVICE_PROTOCOL_VERSION_THAT_SUPPORT_GIT_INFO = '4.8.0';

export function isDeviceProtocolSupportGitInfo (deviceProtocolVersion: string): boolean {
    return semver.gte(deviceProtocolVersion, DEVICE_PROTOCOL_VERSION_THAT_SUPPORT_GIT_INFO);
}

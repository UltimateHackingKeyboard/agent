import semver from 'semver';

const DEVICE_PROTOCOL_VERSION_THAT_SUPPORT_FIRMWARE_CHECKSUM = '4.10.0';

export function isDeviceProtocolSupportFirmwareChecksum (deviceProtocolVersion: string): boolean {
    return semver.gte(deviceProtocolVersion, DEVICE_PROTOCOL_VERSION_THAT_SUPPORT_FIRMWARE_CHECKSUM);
}

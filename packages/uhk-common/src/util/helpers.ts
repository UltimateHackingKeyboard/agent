import { HardwareConfiguration, UhkBuffer, UserConfiguration } from '../../index';

export const getHardwareConfigFromDeviceResponse = (json: string): HardwareConfiguration => {
    const data = JSON.parse(json);
    const hardwareConfig = new HardwareConfiguration();
    hardwareConfig.fromBinary(UhkBuffer.fromArray(data));

    if (hardwareConfig.uniqueId > 0) {
        return hardwareConfig;
    }
    return null;
};

export const getUserConfigFromDeviceResponse = (json: string): UserConfiguration => {
    const data = JSON.parse(json);
    const userConfig = new UserConfiguration();
    userConfig.fromBinary(UhkBuffer.fromArray(data));

    if (userConfig.userConfigMajorVersion > 0) {
        return userConfig;
    }

    throw Error('Invalid user configuration');
};

export const mapObjectToUserConfigBinaryBuffer = (obj: any): Buffer => {
    const configuration = new UserConfiguration();
    configuration.fromJsonObject(obj);
    const buffer = new UhkBuffer();
    configuration.toBinary(buffer);

    return buffer.getBufferContent();
};

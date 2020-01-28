import { Buffer } from 'buffer/';

import { HardwareConfiguration, UhkBuffer, UserConfiguration } from '../config-serializer';

export const getHardwareConfigFromDeviceResponse = (json: string): HardwareConfiguration => {
    const data = JSON.parse(json);
    const hardwareConfig = new HardwareConfiguration();
    hardwareConfig.fromBinary(UhkBuffer.fromArray(data));

    if (hardwareConfig.signature === 'FTY') {
        throw Error('The device is in factory reset mode. Power-cycle the device to use it with Agent!');
    }

    if (hardwareConfig.signature !== 'UHK') {
        throw Error('Please power cycle your keyboard (Invalid hardware configuration: Invalid signature)');
    }

    return hardwareConfig;
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
    const buffer = new UhkBuffer(32768);
    configuration.toBinary(buffer);

    return buffer.getBufferContent();
};

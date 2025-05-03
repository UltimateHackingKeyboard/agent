// / need to load the buffer package from dependency instead of use node default buffer
import { Buffer } from '../buffer.js';

import { HardwareConfiguration, UhkBuffer, UserConfiguration } from '../config-serializer/index.js';
import { shouldUpgradeAgent } from './should-upgrade-agent.js';

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

export type ParsedUserConfigurationResult = 'invalid' | 'newer' | 'success';

export interface ParsedUserConfiguration {
    error?: Error;
    result: ParsedUserConfigurationResult;
    userConfiguration?: UserConfiguration;
    userConfigurationVersion: string;
}

export const getUserConfigFromDeviceResponse = (json: string): ParsedUserConfiguration => {
    try {
        const data = JSON.parse(json);
        const uhkBuffer = UhkBuffer.fromArray(data)
        const userConfigMajorVersion = uhkBuffer.readUInt16();
        const userConfigMinorVersion = uhkBuffer.readUInt16();
        const userConfigPatchVersion = uhkBuffer.readUInt16();
        uhkBuffer.offset = 0;

        const userConfigurationVersion = `${userConfigMajorVersion}.${userConfigMinorVersion}.${userConfigPatchVersion}`
        if (shouldUpgradeAgent(userConfigurationVersion, false)) {
            return {
                result: 'newer',
                userConfigurationVersion,
            }
        }

        const userConfig = new UserConfiguration();
        userConfig.fromBinary(uhkBuffer);

        if (userConfig.userConfigMajorVersion > 0) {
            return {
                result: 'success',
                userConfiguration: userConfig,
                userConfigurationVersion,
            };
        }

        return {
            result: 'invalid',
            userConfigurationVersion,
        };
    }
    catch (error) {
        return {
            error,
            userConfigurationVersion: '',
            result: 'invalid',
        }
    }
};

export const getUserConfigFromJsonObject = (data: any): UserConfiguration  => {
    const userConfig = new UserConfiguration();
    userConfig.fromJsonObject(data);

    if (userConfig.userConfigMajorVersion > 0) {
        return userConfig;
    }

    throw Error('JSON string is an invalid user configuration');
};

export const mapObjectToUserConfigBinaryBuffer = (obj: any): Buffer => {
    const configuration = new UserConfiguration();
    configuration.fromJsonObject(obj);
    const buffer = new UhkBuffer(32768);
    configuration.toBinary(buffer);

    return buffer.getBufferContent();
};

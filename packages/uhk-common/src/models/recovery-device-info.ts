import { UserConfiguration } from '../config-serializer/config-items/user-configuration.js';
import { UHK_DEVICE_IDS_TYPE } from './uhk-device-ids.js';

export interface RecoveryDeviceInfo {
    deviceId: UHK_DEVICE_IDS_TYPE;
    userConfig: UserConfiguration;
}

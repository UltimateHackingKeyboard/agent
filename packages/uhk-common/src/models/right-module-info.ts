import { DeviceModuleRecord } from './device-module-record.js';
import { DeviceVersionInformation } from './device-version-information.js';

export interface RightModuleInfo extends DeviceVersionInformation {
    modules: DeviceModuleRecord;
}

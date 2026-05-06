import { DeviceModule } from './device-module.js';
import { DeviceVersionInformation } from './device-version-information.js';

export interface RightModuleInfo extends DeviceVersionInformation {
    modules: Record<number, DeviceModule>;
}

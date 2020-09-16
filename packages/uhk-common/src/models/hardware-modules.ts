import { ModuleVersionInfo } from './module-version-info';
import { RightModuleInfo } from './right-module-info';

export interface HardwareModules {
    leftModuleInfo?: ModuleVersionInfo;
    rightModuleInfo?: RightModuleInfo;
}

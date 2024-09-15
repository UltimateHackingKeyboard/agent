import { ModuleVersionInfo } from './module-version-info.js';
import { RightModuleInfo } from './right-module-info.js';
import { UhkModule } from './uhk-products.js';

export interface ModuleInfo {
    module: UhkModule;
    info: ModuleVersionInfo;
}

export interface HardwareModules {
    dongleInfo?: RightModuleInfo;
    moduleInfos?: ModuleInfo[];
    rightModuleInfo?: RightModuleInfo;
}

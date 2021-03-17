import { ModuleVersionInfo } from './module-version-info';
import { RightModuleInfo } from './right-module-info';
import { UhkModule } from './uhk-products';

export interface ModuleInfo {
    module: UhkModule;
    info: ModuleVersionInfo;
}

export interface HardwareModules {
    moduleInfos?: ModuleInfo[];
    rightModuleInfo?: RightModuleInfo;
}

import { ClassArray } from '../ClassArray';
import { UhkBuffer } from '../UhkBuffer';
import { ModuleConfiguration } from './ModuleConfiguration';

export class ModuleConfigurations extends ClassArray<ModuleConfiguration> {

    jsObjectToClass(jsObject: any): ModuleConfiguration {
        return new ModuleConfiguration().fromJsObject(jsObject);
    }

    binaryToClass(buffer: UhkBuffer): ModuleConfiguration {
        return new ModuleConfiguration().fromBinary(buffer);
    }

}

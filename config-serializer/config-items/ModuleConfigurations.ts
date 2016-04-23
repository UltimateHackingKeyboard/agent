import {ClassArray} from '../ClassArray';
import {ModuleConfiguration} from './ModuleConfiguration';
import {UhkBuffer} from '../UhkBuffer';

export class ModuleConfigurations extends ClassArray<ModuleConfiguration> {

    jsObjectToClass(jsObject: any): ModuleConfiguration {
        return new ModuleConfiguration().fromJsObject(jsObject);
    }

    binaryToClass(buffer: UhkBuffer): ModuleConfiguration {
        return new ModuleConfiguration().fromBinary(buffer);
    }

}

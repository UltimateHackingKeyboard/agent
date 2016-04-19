import {ClassArray} from '../ClassArray';
import {Serializable} from '../Serializable';
import {ModuleConfiguration} from './ModuleConfiguration';
import {UhkBuffer} from '../UhkBuffer';

export class ModuleConfigurations extends ClassArray<ModuleConfiguration> {

    jsObjectToClass(jsObject: any): Serializable<ModuleConfiguration> {
        return new ModuleConfiguration().fromJsObject(jsObject);
    }

    binaryToClass(buffer: UhkBuffer): Serializable<ModuleConfiguration> {
        return new ModuleConfiguration().fromBinary(buffer);
    }

}

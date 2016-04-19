import {ClassArray} from '../ClassArray';
import {Module} from './Module';
import {Serializable} from '../Serializable';
import {UhkBuffer} from '../UhkBuffer';

export class Modules extends ClassArray<Module> {

    jsObjectToClass(jsObject: any): Serializable<Module> {
        return new Module().fromJsObject(jsObject);
    }

    binaryToClass(buffer: UhkBuffer): Serializable<Module> {
        return new Module().fromBinary(buffer);
    }

}

import {ClassArray} from '../ClassArray';
import {Module} from './Module';
import {UhkBuffer} from '../UhkBuffer';

export class Modules extends ClassArray<Module> {

    jsObjectToClass(jsObject: any): Module {
        return new Module().fromJsObject(jsObject);
    }

    binaryToClass(buffer: UhkBuffer): Module {
        return new Module().fromBinary(buffer);
    }

}

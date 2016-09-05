import {ClassArray} from '../ClassArray';
import {UhkBuffer} from '../UhkBuffer';
import {Module} from './Module';

export class Modules extends ClassArray<Module> {

    jsObjectToClass(jsObject: any): Module {
        return new Module().fromJsObject(jsObject);
    }

    binaryToClass(buffer: UhkBuffer): Module {
        return new Module().fromBinary(buffer);
    }

}

import {ClassArray} from '../ClassArray';
import {Macro} from './Macro';
import {UhkBuffer} from '../UhkBuffer';

export class Macros extends ClassArray<Macro> {

    jsObjectToClass(jsObject: any): Macro {
        return new Macro().fromJsObject(jsObject);
    }

    binaryToClass(buffer: UhkBuffer): Macro {
        return new Macro().fromBinary(buffer);
    }

}

import {ClassArray} from '../ClassArray';
import {UhkBuffer} from '../UhkBuffer';
import {Macro} from './Macro';

export class Macros extends ClassArray<Macro> {

    jsObjectToClass(jsObject: any): Macro {
        return new Macro().fromJsObject(jsObject);
    }

    binaryToClass(buffer: UhkBuffer): Macro {
        return new Macro().fromBinary(buffer);
    }

}

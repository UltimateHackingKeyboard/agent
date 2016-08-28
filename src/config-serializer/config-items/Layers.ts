import {ClassArray} from '../ClassArray';
import {UhkBuffer} from '../UhkBuffer';
import {Layer} from './Layer';

export class Layers extends ClassArray<Layer> {

    jsObjectToClass(jsObject: any): Layer {
        return new Layer().fromJsObject(jsObject);
    }

    binaryToClass(buffer: UhkBuffer): Layer {
        return new Layer().fromBinary(buffer);
    }

}

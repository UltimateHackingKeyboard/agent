import {ClassArray} from '../ClassArray';
import {Serializable} from '../Serializable';
import {UhkBuffer} from '../UhkBuffer';
import {Layer} from './Layer';

export class Layers extends ClassArray<Layer> {

    jsObjectToClass(jsObject: any): Serializable<Layer> {
        return new Layer().fromJsObject(jsObject);
    }

    binaryToClass(buffer: UhkBuffer): Serializable<Layer> {
        return new Layer().fromBinary(buffer);
    }

}

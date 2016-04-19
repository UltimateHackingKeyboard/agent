import {ClassArray} from '../ClassArray';
import {Serializable} from '../Serializable';
import {UhkBuffer} from '../UhkBuffer';
import {KeyMap} from './KeyMap';

export class KeyMaps extends ClassArray<KeyMap> {

    jsObjectToClass(jsObject: any): Serializable<KeyMap> {
        return new KeyMap().fromJsObject(jsObject);
    }

    binaryToClass(buffer: UhkBuffer): Serializable<KeyMap> {
        return new KeyMap().fromBinary(buffer);
    }

}

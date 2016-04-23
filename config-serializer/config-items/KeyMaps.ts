import {ClassArray} from '../ClassArray';
import {UhkBuffer} from '../UhkBuffer';
import {KeyMap} from './KeyMap';

export class KeyMaps extends ClassArray<KeyMap> {

    jsObjectToClass(jsObject: any): KeyMap {
        return new KeyMap().fromJsObject(jsObject);
    }

    binaryToClass(buffer: UhkBuffer): KeyMap {
        return new KeyMap().fromBinary(buffer);
    }

}

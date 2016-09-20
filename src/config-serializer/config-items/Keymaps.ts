import { ClassArray } from '../ClassArray';
import { UhkBuffer } from '../UhkBuffer';
import { Keymap } from './Keymap';

export class Keymaps extends ClassArray<Keymap> {

    jsObjectToClass(jsObject: any): Keymap {
        return new Keymap().fromJsObject(jsObject);
    }

    binaryToClass(buffer: UhkBuffer): Keymap {
        return new Keymap().fromBinary(buffer);
    }

}

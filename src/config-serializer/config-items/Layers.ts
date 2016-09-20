import { ClassArray } from '../ClassArray';
import { UhkBuffer } from '../UhkBuffer';
import { Layer } from './Layer';

export class Layers extends ClassArray<Layer> {

    constructor(layers?: Layers) {
        super();
        if (!layers) {
            return;
        }
        layers.elements.forEach(layer => this.elements.push(new Layer(layer)));
    }

    jsObjectToClass(jsObject: any): Layer {
        return new Layer().fromJsObject(jsObject);
    }

    binaryToClass(buffer: UhkBuffer): Layer {
        return new Layer().fromBinary(buffer);
    }

}

import { AnimationKeyboard } from '../../components/svg/wrap';
import { Serializable } from '../Serializable';
import { UhkBuffer } from '../UhkBuffer';
import { Module } from './Module';

export class Layer extends Serializable<Layer> {

    modules: Module[];
    animation: AnimationKeyboard;

    constructor(layers?: Layer) {
        super();
        if (!layers) {
            this.animation = 'none';
            return;
        }
        this.modules = layers.modules.map(module => new Module(module));
        this.animation = layers.animation;
    }

    _fromJsObject(jsObject: any): Layer {
        this.modules = jsObject.modules.map((module: any) => new Module().fromJsObject(module));
        return this;
    }

    _fromBinary(buffer: UhkBuffer): Layer {
        this.modules = buffer.readArray<Module>(Module);
        return this;
    }

    _toJsObject(): any {
        return {
            modules: this.modules.map(module => module.toJsObject())
        };
    }

    _toBinary(buffer: UhkBuffer): void {
        buffer.writeArray(this.modules);
    }

    toString(): string {
        return `<Layer>`;
    }

}

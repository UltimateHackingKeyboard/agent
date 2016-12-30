import { Serializable } from '../Serializable';
import { UhkBuffer } from '../UhkBuffer';
import { Keymap } from './Keymap';
import { Macro } from './Macro';
import { Module } from './Module';

export class Layer extends Serializable<Layer> {

    modules: Module[];

    constructor(layers?: Layer) {
        super();
        if (!layers) {
            return;
        }
        this.modules = layers.modules.map(module => new Module(module));
    }

    fromJsonObject(jsonObject: any): Layer {
        this.modules = jsonObject.modules.map((module: any) => new Module().fromJsonObject(module));
        return this;
    }

    fromBinary(buffer: UhkBuffer): Layer {
        this.modules = buffer.readArray<Module>(uhkBuffer => {
            return new Module().fromBinary(uhkBuffer);
        });
        return this;
    }

    _toJsonObject(): any {
        return {
            modules: this.modules.map(module => module.toJsonObject())
        };
    }

    _toBinary(buffer: UhkBuffer): void {
        buffer.writeArray(this.modules);
    }

    toString(): string {
        return `<Layer>`;
    }

}

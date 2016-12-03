import { AnimationKeyboard } from '../../components/svg/wrap';
import { Serializable } from '../Serializable';
import { UhkBuffer } from '../UhkBuffer';
import { Keymap } from './Keymap';
import { Macro } from './Macro';
import { Module } from './Module';

export class Layer extends Serializable<Layer> {

    modules: Module[];
    animation: AnimationKeyboard;

    constructor(layers?: Layer, keymaps?: Keymap[], macros?: Macro[]) {
        super();
        if (!layers) {
            return;
        }
        this.modules = layers.modules.map(module => new Module(module, keymaps, macros));
        this.animation = layers.animation;
    }

    fromJsonObject(jsonObject: any, keymaps?: Keymap[], macros?: Macro[]): Layer {
        this.modules = jsonObject.modules.map((module: any) => new Module().fromJsonObject(module, keymaps, macros));
        return this;
    }

    fromBinary(buffer: UhkBuffer, keymaps?: Keymap[], macros?: Macro[]): Layer {
        this.modules = buffer.readArray<Module>(uhkBuffer => {
            return new Module().fromBinary(uhkBuffer, keymaps, macros);
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

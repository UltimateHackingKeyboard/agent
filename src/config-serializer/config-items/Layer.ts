import { UhkBuffer } from '../UhkBuffer';
import { Keymap } from './Keymap';
import { Macro } from './Macro';
import { Module } from './Module';

export class Layer {

    modules: Module[];

    constructor(layers?: Layer) {
        if (!layers) {
            return;
        }
        this.modules = layers.modules.map(module => new Module(module));
    }

    fromJsonObject(jsonObject: any, macros?: Macro[]): Layer {
        this.modules = jsonObject.modules.map((module: any) => new Module().fromJsonObject(module, macros));
        return this;
    }

    fromBinary(buffer: UhkBuffer, macros?: Macro[]): Layer {
        this.modules = buffer.readArray<Module>(uhkBuffer => {
            return new Module().fromBinary(uhkBuffer, macros);
        });
        return this;
    }

    toJsonObject(macros?: Macro[]): any {
        return {
            modules: this.modules.map(module => module.toJsonObject(macros))
        };
    }

    toBinary(buffer: UhkBuffer, macros?: Macro[]): void {
        buffer.writeArray(this.modules, (uhkBuffer: UhkBuffer, module: Module) => {
            module.toBinary(uhkBuffer, macros);
        });
    }

    toString(): string {
        return `<Layer>`;
    }

}

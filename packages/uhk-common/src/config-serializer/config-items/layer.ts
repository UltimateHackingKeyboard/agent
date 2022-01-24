import { UhkBuffer } from '../uhk-buffer';
import { assertEnum } from '../assert';

import { Macro } from './macro';
import { Module } from './module';
import { UserConfiguration } from './user-configuration';
import { LayerName } from './layer-name';

export class Layer {

    @assertEnum(LayerName) id: LayerName;

    modules: Module[];

    constructor(layers?: Layer) {
        if (!layers) {
            return;
        }
        this.id = layers.id;
        this.modules = layers.modules.map(module => new Module(module));
    }

    fromJsonObject(jsonObject: any, macros: Macro[], version: number): Layer {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
                this.fromJsonObjectV1(jsonObject, macros, version);
                break;

            case 5:
                this.fromJsonObjectV5(jsonObject, macros, version);
                break;

            default:
                throw new Error(`Layer configuration does not support version: ${version}`);
        }

        return this;
    }

    fromBinary(buffer: UhkBuffer, macros: Macro[], version: number): Layer {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
                this.fromBinaryV1(buffer, macros, version);
                break;

            case 5:
                this.fromBinaryV5(buffer, macros, version);
                break;

            default:
                throw new Error(`Layer configuration does not support version: ${version}`);
        }

        return this;
    }

    toJsonObject(macros?: Macro[]): any {
        return {
            id: LayerName[this.id],
            modules: this.modules.map(module => module.toJsonObject(macros))
        };
    }

    toBinary(buffer: UhkBuffer, userConfiguration: UserConfiguration): void {
        buffer.writeUInt8(this.id);
        buffer.writeArray(this.modules, (uhkBuffer: UhkBuffer, module: Module) => {
            module.toBinary(uhkBuffer, userConfiguration);
        });
    }

    toString(): string {
        return `<Layer id="${this.id}">`;
    }

    renameKeymap(oldAbbr: string, newAbbr: string): Layer {
        let modules: Module[];
        let moduleModified = false;
        this.modules.forEach((module, index) => {
            const newModule = module.renameKeymap(oldAbbr, newAbbr);
            if (newModule !== module) {
                if (!moduleModified) {
                    modules = this.modules.slice();
                    moduleModified = true;
                }
                modules[index] = newModule;
            }
        });
        if (moduleModified) {
            const newLayer = Object.assign(new Layer(), this);
            newLayer.modules = modules;
            return newLayer;
        }
        return this;
    }

    fromJsonObjectV1(jsonObject: any, macros: Macro[], version: number): void {
        this.modules = jsonObject.modules.map((module: any) => {
            return new Module().fromJsonObject(module, macros, version);
        });
    }

    fromBinaryV1(buffer: UhkBuffer, macros: Macro[], version: number): void {
        this.modules = buffer.readArray<Module>(uhkBuffer => {
            return new Module().fromBinary(uhkBuffer, macros, version);
        });
    }

    fromJsonObjectV5(jsonObject: any, macros: Macro[], version: number): void {
        this.id = LayerName[<string>jsonObject.id];
        this.modules = jsonObject.modules.map((module: any) => {
            return new Module().fromJsonObject(module, macros, version);
        });
    }

    fromBinaryV5(buffer: UhkBuffer, macros: Macro[], version: number): void {
        this.id = buffer.readUInt8();
        this.modules = buffer.readArray<Module>(uhkBuffer => {
            return new Module().fromBinary(uhkBuffer, macros, version);
        });
    }
}

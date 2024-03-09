import { UhkBuffer } from '../uhk-buffer.js';
import { assertEnum } from '../assert.js';

import { Macro } from './macro.js';
import { Module } from './module.js';
import { SerialisationInfo } from './serialisation-info.js';
import { UhkThemeColors } from './uhk-theme-colors.js';
import { UserConfiguration } from './user-configuration.js';
import { LayerName } from './layer-name.js';

export class Layer {

    @assertEnum(LayerName) id: LayerName;

    modules: Module[];

    uhkThemeColors: UhkThemeColors;

    constructor(layers?: Layer) {
        if (!layers) {
            return;
        }
        this.id = layers.id;
        this.modules = layers.modules.map(module => new Module(module));
        this.uhkThemeColors = layers.uhkThemeColors;
    }

    fromJsonObject(jsonObject: any, macros: Macro[], serialisationInfo: SerialisationInfo): Layer {
        switch (serialisationInfo.userConfigMajorVersion) {
            case 1:
            case 2:
            case 3:
            case 4:
                this.fromJsonObjectV1(jsonObject, macros, serialisationInfo);
                break;

            case 5:
            case 6:
            case 7:
                this.fromJsonObjectV5(jsonObject, macros, serialisationInfo);
                break;

            default:
                throw new Error(`Layer configuration does not support version: ${serialisationInfo.userConfigMajorVersion}`);
        }

        return this;
    }

    fromBinary(buffer: UhkBuffer, macros: Macro[], serialisationInfo: SerialisationInfo): Layer {
        switch (serialisationInfo.userConfigMajorVersion) {
            case 1:
            case 2:
            case 3:
            case 4:
                this.fromBinaryV1(buffer, macros, serialisationInfo);
                break;

            case 5:
            case 6:
            case 7:
                this.fromBinaryV5(buffer, macros, serialisationInfo);
                break;

            default:
                throw new Error(`Layer configuration does not support version: ${serialisationInfo.userConfigMajorVersion}`);
        }

        return this;
    }

    toJsonObject(serialisationInfo: SerialisationInfo, macros?: Macro[]): any {
        return {
            id: LayerName[this.id],
            modules: this.modules.map(module => module.toJsonObject(serialisationInfo, macros))
        };
    }

    toBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo, userConfiguration: UserConfiguration): void {
        buffer.writeUInt8(this.id);
        buffer.writeArray(this.modules, (uhkBuffer: UhkBuffer, module: Module) => {
            module.toBinary(uhkBuffer, serialisationInfo, userConfiguration);
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

    fromJsonObjectV1(jsonObject: any, macros: Macro[], serialisationInfo: SerialisationInfo): void {
        this.modules = jsonObject.modules.map((module: any) => {
            return new Module().fromJsonObject(module, macros, serialisationInfo);
        });
    }

    fromBinaryV1(buffer: UhkBuffer, macros: Macro[], serialisationInfo: SerialisationInfo): void {
        this.modules = buffer.readArray<Module>(uhkBuffer => {
            return new Module().fromBinary(uhkBuffer, macros, serialisationInfo);
        });
    }

    fromJsonObjectV5(jsonObject: any, macros: Macro[], serialisationInfo: SerialisationInfo): void {
        this.id = LayerName[<string>jsonObject.id];
        this.modules = jsonObject.modules.map((module: any) => {
            return new Module().fromJsonObject(module, macros, serialisationInfo);
        });
    }

    fromBinaryV5(buffer: UhkBuffer, macros: Macro[], serialisationInfo: SerialisationInfo): void {
        this.id = buffer.readUInt8();
        this.modules = buffer.readArray<Module>(uhkBuffer => {
            return new Module().fromBinary(uhkBuffer, macros, serialisationInfo);
        });
    }
}

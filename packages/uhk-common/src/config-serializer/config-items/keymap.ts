import { UhkBuffer } from '../uhk-buffer.js';
import { Layer } from './layer.js';
import { Macro } from './macro.js';
import { KeyActionHelper, SwitchLayerAction } from './key-action/index.js';
import { UserConfiguration } from './user-configuration.js';

export class Keymap {

    name: string;

    description: string;

    abbreviation: string;

    isDefault: boolean;

    layers: Layer[];

    constructor(keymap?: Keymap) {
        if (!keymap) {
            return;
        }

        this.name = keymap.name;
        this.description = keymap.description;
        this.abbreviation = keymap.abbreviation;
        this.isDefault = keymap.isDefault;
        this.layers = keymap.layers.map(layer => new Layer(layer));
    }

    fromJsonObject(jsonObject: any, macros: Macro[], version: number): Keymap {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                this.fromJsonObjectV1(jsonObject, macros, version);
                break;

            default:
                throw new Error(`Keymap configuration does not support version: ${version}`);
        }

        this.normalize(version);

        return this;
    }

    fromBinary(buffer: UhkBuffer, macros: Macro[], version: number): Keymap {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                this.fromBinaryV1(buffer, macros, version);
                break;

            default:
                throw new Error(`Keymap configuration does not support version: ${version}`);
        }

        this.normalize(version);

        return this;
    }

    toJsonObject(macros?: Macro[]): any {
        return {
            isDefault: this.isDefault,
            abbreviation: this.abbreviation,
            name: this.name,
            description: this.description,
            layers: this.layers.map(layer => layer.toJsonObject(macros))
        };
    }

    toBinary(buffer: UhkBuffer, userConfiguration: UserConfiguration): void {
        buffer.writeString(this.abbreviation);
        buffer.writeBoolean(this.isDefault);
        buffer.writeString(this.name);
        buffer.writeString(this.description);
        buffer.writeArray(this.layers, (uhkBuffer: UhkBuffer, layer: Layer) => {
            layer.toBinary(uhkBuffer, userConfiguration);
        });
    }

    toString(): string {
        return `<Keymap abbreviation="${this.abbreviation}" name="${this.name}">`;
    }

    renameKeymap(oldAbbr: string, newAbbr: string): Keymap {
        let layers: Layer[];
        let layerModified = false;
        this.layers.forEach((layer, index) => {
            const newLayer = layer.renameKeymap(oldAbbr, newAbbr);
            if (newLayer !== layer) {
                if (!layerModified) {
                    layers = this.layers.slice();
                    layerModified = true;
                }
                layers[index] = newLayer;
            }
        });
        if (layerModified) {
            const newKeymap = Object.assign(new Keymap(), this);
            newKeymap.layers = layers;
            return newKeymap;
        }
        return this;
    }

    private normalize(version: number) {
        if (this.layers.length < 1) {
            return;
        }

        for (let moduleId = 0; moduleId < this.layers[0].modules.length && moduleId < 2; moduleId++) {
            const baseModule = this.layers[0].modules[moduleId];
            for (let keyActionId = 0; keyActionId < baseModule.keyActions.length; keyActionId++) {
                const baseKeyAction = baseModule.keyActions[keyActionId];

                if (baseKeyAction instanceof SwitchLayerAction) {
                    const destinationLayerId = baseKeyAction.layer + 1;
                    if (this.layers.length < destinationLayerId) {
                        // TODO: What should we do???
                        console.error(`${this.name} has not enough layer. Need: ${destinationLayerId}`);
                    }
                }

                for (let currentLayerId = 1; currentLayerId < this.layers.length; currentLayerId++) {
                    const currentLayer = this.layers[currentLayerId];
                    if (currentLayer.modules.length < moduleId) {
                        // TODO: What should we do???
                        console.error(`${this.name}.layers[${currentLayerId}] has not enough module. Need: ${moduleId}`);
                        continue;
                    }
                    const currentModule = currentLayer.modules[moduleId];
                    const currentKeyAction = currentModule.keyActions[keyActionId];

                    if (baseKeyAction instanceof SwitchLayerAction) {
                        if (currentLayerId - 1 === baseKeyAction.layer) {
                            if (currentKeyAction instanceof SwitchLayerAction) {
                                if (currentKeyAction.layer === baseKeyAction.layer &&
                                    currentKeyAction.switchLayerMode === baseKeyAction.switchLayerMode) {
                                    continue;
                                }
                                const error = `${this.name}.layers[${currentLayerId}]modules[${moduleId}].keyActions[${keyActionId}]` +
                                    ` is different switch layer. ${currentKeyAction} will be override with ${baseKeyAction}`;
                                console.warn(error);
                            } else {
                                const error = `${this.name}.layers[${currentLayerId}]modules[${moduleId}].keyActions[${keyActionId}]` +
                                    ` is not switch layer. ${currentKeyAction} will be override with ${baseKeyAction}`;
                                console.warn(error);
                            }
                            currentModule.keyActions[keyActionId] = KeyActionHelper.createKeyAction(baseKeyAction, null, version);
                        }
                    }
                    else {
                        if (currentKeyAction instanceof SwitchLayerAction) {
                            const error = `${this.name}.layers[${currentLayerId}]modules[${moduleId}].keyActions[${keyActionId}]` +
                                ` is switch layer action, but the base key action is not switch layer action, so will delete`;
                            console.warn(error);
                            currentModule.keyActions[keyActionId] = null;
                        }
                    }
                }
            }
        }
    }

    private fromJsonObjectV1(jsonObject: any, macros: Macro[], version: number): void {
        this.isDefault = jsonObject.isDefault;
        this.abbreviation = jsonObject.abbreviation;
        this.name = jsonObject.name;
        this.description = jsonObject.description;
        this.layers = jsonObject.layers.map((layer: any) => new Layer().fromJsonObject(layer, macros, version));
    }

    private fromBinaryV1(buffer: UhkBuffer, macros: Macro[], version: number): void {
        this.abbreviation = buffer.readString();
        this.isDefault = buffer.readBoolean();
        this.name = buffer.readString();
        this.description = buffer.readString();
        this.layers = buffer.readArray<Layer>(uhkBuffer => {
            return new Layer().fromBinary(uhkBuffer,  macros, version);
        });
    }
}

export function getEmptyKeymap(): Keymap {
    const keymap = new Keymap();
    keymap.layers = [];

    return keymap;
}

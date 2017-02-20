import { UhkBuffer } from '../UhkBuffer';
import { Layer } from './Layer';
import { Macro } from './Macro';

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

    fromJsonObject(jsonObject: any, macros?: Macro[]): Keymap {
        this.isDefault = jsonObject.isDefault;
        this.abbreviation = jsonObject.abbreviation;
        this.name = jsonObject.name;
        this.description = jsonObject.description;
        this.layers = jsonObject.layers.map((layer: any) => new Layer().fromJsonObject(layer, macros));
        return this;
    }

    fromBinary(buffer: UhkBuffer, macros?: Macro[]): Keymap {
        this.abbreviation = buffer.readString();
        this.isDefault = buffer.readBoolean();
        this.name = buffer.readString();
        this.description = buffer.readString();
        this.layers = buffer.readArray<Layer>(uhkBuffer => {
            return new Layer().fromBinary(uhkBuffer, macros);
        });
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

    toBinary(buffer: UhkBuffer, macros?: Macro[]): void {
        buffer.writeString(this.abbreviation);
        buffer.writeBoolean(this.isDefault);
        buffer.writeString(this.name);
        buffer.writeString(this.description);
        buffer.writeArray(this.layers, (uhkBuffer: UhkBuffer, layer: Layer) => {
            layer.toBinary(uhkBuffer, macros);
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

}

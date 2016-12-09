import { Serializable } from '../Serializable';
import { UhkBuffer } from '../UhkBuffer';
import { Layer } from './Layer';
import { Macro } from './Macro';

export class Keymap extends Serializable<Keymap> {

    name: string;

    description: string;

    abbreviation: string;

    isDefault: boolean;

    layers: Layer[];

    constructor(keymap?: Keymap, getKeymap?: (abbrevation: string) => Keymap, getMacro?: (macroId: number) => Macro) {
        super();
        if (!keymap) {
            return;
        }

        this.name = keymap.name;
        this.description = keymap.description;
        this.abbreviation = keymap.abbreviation;
        this.isDefault = keymap.isDefault;
        this.layers = keymap.layers.map(layer => new Layer(layer, getKeymap, getMacro));
    }

    fromJsonObject(jsonObject: any, getKeymap?: (abbrevation: string) => Keymap, getMacro?: (macroId: number) => Macro): Keymap {
        this.isDefault = jsonObject.isDefault;
        this.abbreviation = jsonObject.abbreviation;
        this.name = jsonObject.name;
        this.description = jsonObject.description;
        this.layers = jsonObject.layers.map((layer: any) => new Layer().fromJsonObject(layer, getKeymap, getMacro));
        return this;
    }

    fromBinary(buffer: UhkBuffer, getKeymap?: (abbrevation: string) => Keymap, getMacro?: (macroId: number) => Macro): Keymap {
        this.abbreviation = buffer.readString();
        this.isDefault = buffer.readBoolean();
        this.name = buffer.readString();
        this.description = buffer.readString();
        this.layers = buffer.readArray<Layer>(uhkBuffer => {
            return new Layer().fromBinary(uhkBuffer, getKeymap, getMacro);
        });
        return this;
    }

    _toJsonObject(): any {
        return {
            isDefault: this.isDefault,
            abbreviation: this.abbreviation,
            name: this.name,
            description: this.description,
            layers: this.layers.map(layer => layer.toJsonObject())
        };
    }

    _toBinary(buffer: UhkBuffer): void {
        buffer.writeString(this.abbreviation);
        buffer.writeBoolean(this.isDefault);
        buffer.writeString(this.name);
        buffer.writeString(this.description);
        buffer.writeArray(this.layers);
    }

    toString(): string {
        return `<Keymap abbreviation="${this.abbreviation}" name="${this.name}">`;
    }
}

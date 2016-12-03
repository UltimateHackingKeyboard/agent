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

    constructor(keymap?: Keymap, keymaps?: Keymap[], macros?: Macro[]) {
        super();
        if (!keymap) {
            return;
        }

        this.name = keymap.name;
        this.description = keymap.description;
        this.abbreviation = keymap.abbreviation;
        this.isDefault = keymap.isDefault;
        this.layers = keymap.layers.map(layer => new Layer(layer, keymaps, macros));
    }

    fromJsonObject(jsonObject: any, keymaps?: Keymap[], macros?: Macro[]): Keymap {
        this.isDefault = jsonObject.isDefault;
        this.abbreviation = jsonObject.abbreviation;
        this.name = jsonObject.name;
        this.description = jsonObject.description;
        this.layers = jsonObject.layers.map((layer: any) => new Layer().fromJsonObject(layer, keymaps, macros));
        return this;
    }

    fromBinary(buffer: UhkBuffer, keymaps?: Keymap[], macros?: Macro[]): Keymap {
        const size = buffer.readUInt16();
        const offset = buffer.offset;
        this.abbreviation = buffer.readString();
        if (!keymaps) {
            buffer.offset = offset + size;
            return this;
        }
        this.isDefault = buffer.readBoolean();
        this.name = buffer.readString();
        this.description = buffer.readString();
        this.layers = buffer.readArray<Layer>(uhkBuffer => {
            return new Layer().fromBinary(uhkBuffer, keymaps, macros);
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
        buffer.writeUInt16(0); // Keymap size
        const offset = buffer.offset;
        buffer.writeString(this.abbreviation);
        buffer.writeBoolean(this.isDefault);
        buffer.writeString(this.name);
        buffer.writeString(this.description);
        buffer.writeArray(this.layers);
        const size = buffer.offset - offset;
        buffer.offset = offset - 2;
        buffer.writeUInt16(size);
        buffer.offset = offset + size; // Set offset to the end
    }

    toString(): string {
        return `<Keymap abbreviation="${this.abbreviation}" name="${this.name}">`;
    }
}

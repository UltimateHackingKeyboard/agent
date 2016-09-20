import { Serializable } from '../Serializable';
import { UhkBuffer } from '../UhkBuffer';
import { Layers } from './Layers';

export class Keymap extends Serializable<Keymap> {

    name: string;

    description: string;

    abbreviation: string;

    isDefault: boolean;

    layers: Layers;

    constructor(keymap?: Keymap) {
        super();
        if (!keymap) {
            return;
        }

        this.name = keymap.name;
        this.description = keymap.description;
        this.abbreviation = keymap.abbreviation;
        this.isDefault = keymap.isDefault;
        this.layers = new Layers(keymap.layers);
    }

    _fromJsObject(jsObject: any): Keymap {
        this.isDefault = jsObject.isDefault;
        this.abbreviation = jsObject.abbreviation;
        this.name = jsObject.name;
        this.description = jsObject.description;
        this.layers = new Layers().fromJsObject(jsObject.layers);
        return this;
    }

    _fromBinary(buffer: UhkBuffer): Keymap {
        this.isDefault = buffer.readBoolean();
        this.abbreviation = buffer.readString();
        this.name = buffer.readString();
        this.description = buffer.readString();
        this.layers = new Layers().fromBinary(buffer);
        return this;
    }

    _toJsObject(): any {
        return {
            isDefault: this.isDefault,
            abbreviation: this.abbreviation,
            name: this.name,
            description: this.description,
            layers: this.layers.toJsObject()
        };
    }

    _toBinary(buffer: UhkBuffer): void {
        buffer.writeBoolean(this.isDefault);
        buffer.writeString(this.abbreviation);
        buffer.writeString(this.name);
        buffer.writeString(this.description);
        this.layers.toBinary(buffer);
    }

    toString(): string {
        return `<Keymap abbreviation="${this.abbreviation}" name="${this.name}">`;
    }
}

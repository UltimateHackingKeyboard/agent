class KeyMap extends Serializable<KeyMap> {

    // @assertUInt8
    id: number;

    name: string;

    abbreviation: string;

    isDefault: boolean;

    layers: Serializable<Layers>;

    _fromJsObject(jsObject: any): KeyMap {
        this.id = jsObject.id;
        this.isDefault = jsObject.isDefault;
        this.abbreviation = jsObject.abbreviation;
        this.name = jsObject.name;
        this.layers = new Layers().fromJsObject(jsObject.layers);
        return this;
    }

    _fromBinary(buffer: UhkBuffer): KeyMap {
        this.id = buffer.readUInt8();
        this.isDefault = this.binToBool(buffer.readUInt8());
        this.abbreviation = buffer.readString();
        this.name = buffer.readString();
        this.layers = new Layers().fromBinary(buffer);
        return this;
    }

    _toJsObject(): any {
        return {
            id: this.id,
            isDefault: this.isDefault,
            abbreviation: this.abbreviation,
            name: this.name,
            layers: this.layers.toJsObject()
        };
    }

    _toBinary(buffer: UhkBuffer): void {
        buffer.writeUInt8(this.id);
        buffer.writeUInt8(this.boolToBin(this.isDefault));
        buffer.writeString(this.abbreviation);
        buffer.writeString(this.name);
        this.layers.toBinary(buffer);
    }

    toString(): string {
        return `<KeyMap id="${this.id}" name="${this.name}">`;
    }
}

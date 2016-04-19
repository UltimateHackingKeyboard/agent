class UhkConfiguration extends Serializable<UhkConfiguration> {

    // @assertUInt8
    id: number;

    name: string;

    abbreviation: string;

    isDefault: boolean;

    layers: Serializable<Layers>;

    _fromJsObject(jsObject: any): UhkConfiguration {
        this.id = jsObject.id;
        this.isDefault = jsObject.isDefault;
        this.abbreviation = jsObject.abbreviation;
        this.name = jsObject.name;
        this.layers = new Layers().fromJsObject(jsObject.layers);
        return this;
    }

    _fromBinary(buffer: UhkBuffer): UhkConfiguration {
        this.id = buffer.readUInt8();
        this.isDefault = buffer.readBoolean();
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
        buffer.writeBoolean(this.isDefault);
        buffer.writeString(this.abbreviation);
        buffer.writeString(this.name);
        this.layers.toBinary(buffer);
    }

    toString(): string {
        return `<UhkConfiguration id="${this.id}" name="${this.name}">`;
    }
}

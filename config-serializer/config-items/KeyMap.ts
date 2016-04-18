class KeyMap extends Serializable<KeyMap> {

    static defaultFlag = 0x80;

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
        let map = buffer.readUInt8();
        /* saves almost a byte but limits number of keymaps... */
        this.isDefault = (map & KeyMap.defaultFlag) !== 0;
        this.id = map & ~KeyMap.defaultFlag; // Clear isDefault bit.;
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
        buffer.writeUInt8(this.id | this.getDefaultFlag());
        buffer.writeString(this.abbreviation);
        buffer.writeString(this.name);
        this.layers.toBinary(buffer);
    }

    toString(): string {
        return `<KeyMap id="${this.id}" name="${this.name}">`;
    }

    private getDefaultFlag() {
        return this.isDefault ? KeyMap.defaultFlag : 0;
    }
}

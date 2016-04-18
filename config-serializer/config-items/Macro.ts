class Macro extends Serializable<Macro> {

    static loopedFlag  = 0x80;
    static privateFlag = 0x08;

    // @assertUInt8
    id: number;

    isLooped: boolean;

    isPrivate: boolean;

    name: string;

    macroActions: Serializable<MacroActions>;

    _fromJsObject(jsObject: any): Macro {
        this.id = jsObject.id;
        this.isLooped = jsObject.isLooped;
        this.isPrivate = jsObject.isPrivate;
        this.name = jsObject.name;
        this.macroActions = new MacroActions().fromJsObject(jsObject.macroActions);
        return this;
    }

    _fromBinary(buffer: UhkBuffer): Macro {
        this.id = buffer.readUInt8();
        let bools = buffer.readUInt8();
        /* saves almost a byte but limits number of keymaps... */
        this.isLooped = (bools & Macro.loopedFlag) !== 0;
        this.isPrivate = (bools & Macro.privateFlag) !== 0;
        this.name = buffer.readString();
        this.macroActions = new MacroActions().fromBinary(buffer);
        return this;
    }

    _toJsObject(): any {
        return {
            id: this.id,
            isLooped: this.isLooped,
            isPrivate: this.isPrivate,
            name: this.name,
            macroActions: this.macroActions.toJsObject()
        };
    }

    _toBinary(buffer: UhkBuffer): void {
        buffer.writeUInt8(this.id);
        buffer.writeUInt8(this.getLoopedFlag() | this.getPrivateFlag());
        buffer.writeString(this.name);
        this.macroActions.toBinary(buffer);
    }

    toString(): string {
        return `<Macro id="${this.id}" name="${this.name}">`;
    }

    private getLoopedFlag() {
        return this.isLooped ? Macro.loopedFlag : 0;
    }

    private getPrivateFlag() {
        return this.isPrivate ? Macro.privateFlag : 0;
    }
}

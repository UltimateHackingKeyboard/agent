class KeystrokeWithModifiersAction extends KeyAction {

    // @assertUInt8
    modifierMask: number;

    // @assertUInt8
    scancode: number;

    _fromJsObject(jsObject: any): KeystrokeWithModifiersAction {
        this.assertKeyActionType(jsObject);
        this.scancode = jsObject.scancode;
        this.modifierMask = jsObject.modifierMask;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): KeystrokeWithModifiersAction {
        this.readAndAssertKeyActionId(buffer);
        this.scancode = buffer.readUInt8();
        this.modifierMask = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            keyActionType: keyActionType.KeystrokeWithModifiersAction,
            scancode: this.scancode,
            modifierMask: this.modifierMask
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.KeystrokeWithModifiersAction);
        buffer.writeUInt8(this.scancode);
        buffer.writeUInt8(this.modifierMask);
    }

    toString(): string {
        return `<KeystrokeWithModifiersAction scancode="${this.scancode}" modifierMask="${this.modifierMask}">`;
    }
}

class KeystrokeWithModifiersAction extends KeyAction {

    modifierMask: number;

    private _scancode: number;

    get scancode(): number {
        return this._scancode;
    }

    set scancode(value) {
        if (!TypeChecker.isScancodeValid(value)) {
            throw `Invalid KeystrokeWithModifiersAction.scancode: ${value}`;
        }
        this._scancode = value;
    }

    _fromJsObject(jsObject: any): KeystrokeWithModifiersAction {
        this.assertKeyActionType(
            jsObject, KeyActionType.KeystrokeWithModifiersAction, 'KeystrokeWithModifiersAction');
        this.scancode = jsObject.scancode;
        this.modifierMask = jsObject.modifierMask;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): KeystrokeWithModifiersAction {
        this.readAndAssertKeyActionId(buffer, KeyActionId.KeystrokeWithModifiersAction, 'KeystrokeWithModifiersAction');
        this.scancode = buffer.readUInt8();
        this.modifierMask = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            keyActionType: KeyActionType.KeystrokeWithModifiersAction,
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

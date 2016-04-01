class KeystrokeAction extends KeyAction {

    private _scancode: number;

    get scancode(): number {
        return this._scancode;
    }

    set scancode(value) {
        if (!TypeChecker.isScancodeValid(value)) {
            throw `Invalid KeystrokeAction.scancode: ${value}`;
        }
        this._scancode = value;
    }

    _fromJsObject(jsObject: any): KeystrokeAction {
        this.assertKeyActionType(jsObject, KeyActionType.KeystrokeAction, 'KeystrokeAction');
        this.scancode = jsObject.scancode;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): KeystrokeAction {
        this.readAndAssertKeyActionId(buffer, KeyActionId.KeystrokeAction, 'KeystrokeAction');
        this.scancode = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            keyActionType: KeyActionType.KeystrokeAction,
            scancode: this.scancode
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.KeystrokeAction);
        buffer.writeUInt8(this.scancode);
    }

    toString(): string {
        return `<KeystrokeAction scancode="${this.scancode}">`;
    }
}

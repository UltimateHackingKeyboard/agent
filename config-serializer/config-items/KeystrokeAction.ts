class KeystrokeAction extends KeyAction implements Serializable<KeystrokeAction> {

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

    fromJsObject(jsObject: any): KeystrokeAction {
        this.assertKeyActionType(jsObject, KeyActionType.KeystrokeAction, 'KeystrokeAction');
        this.scancode = jsObject.scancode;
        return this;
    }

    fromBinary(buffer: UhkBuffer): KeystrokeAction {
        this.readAndAssertKeyActionId(buffer, KeyActionId.KeystrokeAction, 'KeystrokeAction');
        this.scancode = buffer.readUInt8();
        return this;
    }

    toJsObject(): any {
        return {
            keyActionType: KeyActionType.KeystrokeAction,
            scancode: this.scancode
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.KeystrokeAction);
        buffer.writeUInt8(this.scancode);
    }
}

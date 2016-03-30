class KeystrokeWithModifiersAction extends KeyAction implements Serializable<KeystrokeWithModifiersAction> {

    static keyActionTypeString = 'keystrokeWithModifiers';

    modifierMask: number;

    private _scancode: number;

    get scancode(): number {
        return this._scancode;
    }

    set scancode(value) {
        if (!TypeChecker.isScancodeValid(value)) {
            throw 'Invalid KeystrokeWithModifiersAction.scancode: ${scancode}';
        }
        this._scancode = value;
    }

    fromJsObject(jsObject: any): KeystrokeWithModifiersAction {
        this.assertKeyActionType(
            jsObject, KeystrokeWithModifiersAction.keyActionTypeString, 'KeystrokeWithModifiersAction');
        this.scancode = jsObject.scancode;
        this.modifierMask = jsObject.modifierMask;
        return this;
    }

    fromBinary(buffer: UhkBuffer): KeystrokeWithModifiersAction {
        this.readAndAssertKeyActionId(buffer, KeyActionId.KeystrokeWithModifiersAction, 'KeystrokeWithModifiersAction');
        this.scancode = buffer.readUInt8();
        this.modifierMask = buffer.readUInt8();
        return this;
    }

    toJsObject(): any {
        return {
            keyActionType: KeystrokeWithModifiersAction.keyActionTypeString,
            scancode: this.scancode,
            modifierMask: this.modifierMask
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.KeystrokeWithModifiersAction);
        buffer.writeUInt8(this.scancode);
        buffer.writeUInt8(this.modifierMask);
    }
}

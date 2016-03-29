class KeystrokeAction extends KeyAction implements Serializable<KeystrokeAction> {

    static keyActionTypeString = 'keystroke';

    modifierMask: number;

    private _scancode: number;

    get scancode(): number {
        return this._scancode;
    }

    set scancode(value) {
        if (!TypeChecker.isScancodeValid(value)) {
            throw 'Invalid KeystrokeAction.scancode: ${scancode}';
        }
        this._scancode = value;
    }

    fromJsObject(jsObject: any): KeystrokeAction {
        this.scancode = jsObject.scancode;
        this.modifierMask = jsObject.modifierMask;
        return this;
    }

    fromBinary(buffer: UhkBuffer): KeystrokeAction {
        this.scancode = buffer.readUInt8();
        this.modifierMask = buffer.readUInt8();
        return this;
    }

    toJsObject(): any {
        return {
            keyActionType: KeystrokeAction.keyActionTypeString,
            scancode: this.scancode,
            modifierMask: this.modifierMask
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(this.scancode);
        buffer.writeUInt8(this.modifierMask);
    }
}

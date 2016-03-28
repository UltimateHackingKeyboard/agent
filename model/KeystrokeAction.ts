/// <reference path="KeyAction.ts" />
/// <reference path="Serializable.ts" />

class KeystrokeAction extends KeyAction implements Serializable<KeystrokeAction> {

    static actionTypeString = 'keystroke';
    static firstValidScancode = 1;
    static lastValidScancode = 231;

    _scancode: number;
    modifierMask: number;

    get scancode() {
        return this._scancode;
    }

    set scancode(value) {
        if (!KeystrokeAction.isScancodeValid(value)) {
            throw 'Invalid KeystrokeAction.scancode: ${scancode}';
        }
        this._scancode = value;
    }

    static isScancodeValid(scancode) {
        return KeystrokeAction.firstValidScancode <= scancode &&
               scancode <= KeystrokeAction.lastValidScancode;
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
            keyActionType: KeystrokeAction.actionTypeString,
            scancode: this.scancode,
            modifierMask: this.modifierMask
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(this.scancode);
        buffer.writeUInt8(this.modifierMask);
    }
}

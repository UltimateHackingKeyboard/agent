/// <reference path="KeyAction.ts" />
/// <reference path="Serializable.ts" />

class KeystrokeAction extends KeyAction implements Serializable {

    static firstValidScancode = 1;
    static lastValidScancode = 231;

    _scancode: number;
    modifierMask: number;

    get scancode() {
        return this._scancode;
    }

    set scancode(value) {
        if (!KeystrokeAction.isScancodeValid(value)) {
            throw 'Scancode ${scancode} is invalid!';
        }
        this._scancode = value;
    }

    static isScancodeValid(scancode) {
        return KeystrokeAction.firstValidScancode <= scancode &&
               scancode <= KeystrokeAction.lastValidScancode;
    }

    fromJsObject(jsObject: any) {
        this.scancode = jsObject.scancode;
        this.modifierMask = jsObject.modifierMask;
    }

    toJsObject(): any {
        return {
            scancode: this.scancode,
            modifierMask: this.modifierMask
        };
    }

    fromBinary(buffer: UhkBuffer) {
        this.scancode = buffer.readUInt8();
        this.modifierMask = buffer.readUInt8();
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(this.scancode);
        buffer.writeUInt8(this.modifierMask);
    }
}

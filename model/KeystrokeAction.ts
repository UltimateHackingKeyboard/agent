/// <reference path="Serializable.ts" />

class KeystrokeAction implements Serializable {

    private static firstValidScancode = 1;
    private static lastValidScancode = 231;

    scancode: number;
    modifierMask: number;

    static isScancodeValid(scancode) {
        return KeystrokeAction.firstValidScancode <= scancode &&
               scancode <= KeystrokeAction.lastValidScancode;
    }

    private static checkScancode(scancode) {
        if (!KeystrokeAction.isScancodeValid(scancode)) {
            throw 'Scancode ${scancode} is invalid';
        }
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
        KeystrokeAction.checkScancode(this.scancode);
        this.modifierMask = buffer.readUInt8();
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(this.scancode);
        buffer.writeUInt8(this.modifierMask);
    }
}

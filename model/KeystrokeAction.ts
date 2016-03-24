/// <reference path="Serializable.ts" />

class KeystrokeAction implements Serializable {
    scancode: number; 
    modifierMask: number;

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
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUint8(this.scancode);
        buffer.writeUint8(this.modifierMask);
    } 
}

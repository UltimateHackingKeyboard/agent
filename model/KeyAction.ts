/// <reference path="KeystrokeAction.ts" />

class KeyAction {

    static fromJsObject(jsObject: any): KeyAction {
        switch (jsObject.actionType) {
            case 'keyStroke':
                let keystrokeAction = new KeystrokeAction();
                keystrokeAction.fromJsObject(jsObject);
                return keystrokeAction;
            default:
                throw 'Unknown KeyAction actionType "${jsObject.actionType}"';
        }
    }

    static fromBinary(buffer: UhkBuffer) {
        let keyActionFirstByte = buffer.readUInt8();
        buffer.backtrack();

        if (KeystrokeAction.firstValidScancode <= keyActionFirstByte &&
            keyActionFirstByte <= KeystrokeAction.lastValidScancode)
        {
            let keystrokeAction = new KeystrokeAction();
            keystrokeAction.fromBinary(buffer);
            return keystrokeAction;
        } else {
            throw 'Unknown KeyAction first byte "${keyActionFirstByte}"';
        }
    }
}

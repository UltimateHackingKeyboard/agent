/// <reference path="KeyActionNone.ts" />
/// <reference path="KeystrokeAction.ts" />

class KeyAction {

    static fromJsObject(jsObject: any): KeyAction {
        switch (jsObject.actionType) {
            case 'none':
                let keyActionNone = new KeyActionNone();
                keyActionNone.fromJsObject(jsObject);
                return keyActionNone;
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

        if (KeystrokeAction.isScancodeValid(keyActionFirstByte)) {
            let keystrokeAction = new KeystrokeAction();
            keystrokeAction.fromBinary(buffer);
            return keystrokeAction;
        } else if (keyActionFirstByte === KeyActionNone.keyActionNoneId) {
            let keyActionNone = new KeyActionNone();
            keyActionNone.fromBinary(buffer);
            return keyActionNone;
        } else {
            throw 'Unknown KeyAction first byte "${keyActionFirstByte}"';
        }
    }
}

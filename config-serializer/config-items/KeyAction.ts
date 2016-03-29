class KeyAction {

    static fromJsObject(jsObject: any): KeyAction {
        switch (jsObject.keyActionType) {
            case KeystrokeAction.actionTypeString:
                return new KeystrokeAction().fromJsObject(jsObject);
            case KeyActionNone.actionTypeString:
                return new KeyActionNone().fromJsObject(jsObject);
            default:
                throw 'Invalid KeyAction.keyActionType: "${jsObject.actionType}"';
        }
    }

    static fromBinary(buffer: UhkBuffer): KeyAction {
        let keyActionFirstByte = buffer.readUInt8();
        buffer.backtrack();

        if (KeystrokeAction.isScancodeValid(keyActionFirstByte)) {
            return new KeystrokeAction().fromBinary(buffer);
        } else if (keyActionFirstByte === KeyActionNone.keyActionNoneId) {
            return new KeyActionNone().fromBinary(buffer);
        } else {
            throw 'Invalid KeyAction first byte "${keyActionFirstByte}"';
        }
    }
}

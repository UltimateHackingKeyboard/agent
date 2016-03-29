class KeyAction {

    static fromJsObject(jsObject: any): KeyAction {
        switch (jsObject.keyActionType) {
            case KeystrokeAction.keyActionTypeString:
                return new KeystrokeAction().fromJsObject(jsObject);
            case MouseAction.keyActionTypeString:
                return new MouseAction().fromJsObject(jsObject);
            case KeyActionNone.keyActionTypeString:
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
        } else if (keyActionFirstByte === MouseAction.keyActionId) {
            return new MouseAction().fromBinary(buffer);
        } else if (keyActionFirstByte === KeyActionNone.keyActionId) {
            return new KeyActionNone().fromBinary(buffer);
        } else {
            throw 'Invalid KeyAction first byte "${keyActionFirstByte}"';
        }
    }
}

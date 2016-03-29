class KeyAction {

    static fromJsObject(jsObject: any): KeyAction {
        switch (jsObject.keyActionType) {
            case KeystrokeAction.keyActionTypeString:
                return new KeystrokeAction().fromJsObject(jsObject);
            case MouseAction.keyActionTypeString:
                return new MouseAction().fromJsObject(jsObject);
            case NoneAction.keyActionTypeString:
                return new NoneAction().fromJsObject(jsObject);
            default:
                throw 'Invalid KeyAction.keyActionType: "${jsObject.actionType}"';
        }
    }

    static fromBinary(buffer: UhkBuffer): KeyAction {
        let keyActionFirstByte = buffer.readUInt8();
        buffer.backtrack();

        if (TypeChecker.isScancodeValid(keyActionFirstByte)) {
            return new KeystrokeAction().fromBinary(buffer);
        } else if (keyActionFirstByte === MouseAction.keyActionId) {
            return new MouseAction().fromBinary(buffer);
        } else if (keyActionFirstByte === NoneAction.keyActionId) {
            return new NoneAction().fromBinary(buffer);
        } else {
            throw 'Invalid KeyAction first byte "${keyActionFirstByte}"';
        }
    }
}

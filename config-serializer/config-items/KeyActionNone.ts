class KeyActionNone extends KeyAction implements Serializable<KeyActionNone> {

    static keyActionTypeString = 'none';
    static keyActionId = 0;
    static keyActionNoneParam = 0;

    fromJsObject(jsObject: any): KeyActionNone {
        if (jsObject.keyActionType !== KeyActionNone.keyActionTypeString) {
            throw 'Invalid KeyActionNone.keyActionType: "${jsObject.keyActionType}"';
        }
        return this;
    }

    fromBinary(buffer: UhkBuffer): KeyActionNone {
        let keyActionId = buffer.readUInt8();
        if (keyActionId !== KeyActionNone.keyActionId) {
            throw 'Invalid KeyActionNone.id: ${keyActionId}';
        }

        let keyActionParam = buffer.readUInt8();
        if (keyActionParam !== KeyActionNone.keyActionNoneParam) {
            throw 'Invalid KeyActionNone.param: ${keyActionParam}';
        }

        return this;
    }

    toJsObject(): any {
        return {
            keyActionType: KeyActionNone.keyActionTypeString
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionNone.keyActionId);
        buffer.writeUInt8(KeyActionNone.keyActionNoneParam);
    }
}

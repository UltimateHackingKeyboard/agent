class KeyActionNone extends KeyAction implements Serializable<KeyActionNone> {

    static actionTypeString = 'none';
    static keyActionNoneId = 0;
    static keyActionNoneParam = 0;

    fromJsObject(jsObject: any): KeyActionNone {
        if (jsObject.keyActionType !== KeyActionNone.actionTypeString) {
            throw 'Invalid KeyActionNone.keyActionType: "${jsObject.keyActionType}"';
        }
        return this;
    }

    fromBinary(buffer: UhkBuffer): KeyActionNone {
        let keyActionId = buffer.readUInt8();
        if (keyActionId !== KeyActionNone.keyActionNoneId) {
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
            keyActionType: KeyActionNone.actionTypeString
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionNone.keyActionNoneId);
        buffer.writeUInt8(KeyActionNone.keyActionNoneParam);
    }
}

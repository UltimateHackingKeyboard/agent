class NoneAction extends KeyAction implements Serializable<NoneAction> {

    static keyActionTypeString = 'none';
    static keyActionId = 0;
    static keyActionNoneParam = 0;

    fromJsObject(jsObject: any): NoneAction {
        if (jsObject.keyActionType !== NoneAction.keyActionTypeString) {
            throw 'Invalid KeyActionNone.keyActionType: "${jsObject.keyActionType}"';
        }
        return this;
    }

    fromBinary(buffer: UhkBuffer): NoneAction {
        let keyActionId = buffer.readUInt8();
        if (keyActionId !== NoneAction.keyActionId) {
            throw 'Invalid KeyActionNone.id: ${keyActionId}';
        }

        let keyActionParam = buffer.readUInt8();
        if (keyActionParam !== NoneAction.keyActionNoneParam) {
            throw 'Invalid KeyActionNone.param: ${keyActionParam}';
        }

        return this;
    }

    toJsObject(): any {
        return {
            keyActionType: NoneAction.keyActionTypeString
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(NoneAction.keyActionId);
        buffer.writeUInt8(NoneAction.keyActionNoneParam);
    }
}

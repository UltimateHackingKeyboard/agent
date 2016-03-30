class NoneAction extends KeyAction implements Serializable<NoneAction> {

    static keyActionTypeString = 'none';
    static noneActionParam = 0;

    fromJsObject(jsObject: any): NoneAction {
        if (jsObject.keyActionType !== NoneAction.keyActionTypeString) {
            throw 'Invalid NoneAction.keyActionType: "${jsObject.keyActionType}"';
        }
        return this;
    }

    fromBinary(buffer: UhkBuffer): NoneAction {
        let keyActionId = buffer.readUInt8();
        if (keyActionId !== KeyActionId.NoneAction) {
            throw 'Invalid NoneAction.id: ${keyActionId}';
        }

        let keyActionParam = buffer.readUInt8();
        if (keyActionParam !== NoneAction.noneActionParam) {
            throw 'Invalid NoneAction.param: ${keyActionParam}';
        }

        return this;
    }

    toJsObject(): any {
        return {
            keyActionType: NoneAction.keyActionTypeString
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.NoneAction);
        buffer.writeUInt8(NoneAction.noneActionParam);
    }
}

class NoneAction extends KeyAction implements Serializable<NoneAction> {

    static noneActionParam = 0;

    fromJsObject(jsObject: any): NoneAction {
        this.assertKeyActionType(jsObject, KeyActionType.NoneAction, 'NoneAction');
        return this;
    }

    fromBinary(buffer: UhkBuffer): NoneAction {
        this.readAndAssertKeyActionId(buffer, KeyActionId.NoneAction, 'NoneAction');

        let keyActionParam = buffer.readUInt8();
        if (keyActionParam !== NoneAction.noneActionParam) {
            throw `Invalid NoneAction.param: ${keyActionParam}`;
        }

        return this;
    }

    toJsObject(): any {
        return {
            keyActionType: KeyActionId.NoneAction
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.NoneAction);
    }
}

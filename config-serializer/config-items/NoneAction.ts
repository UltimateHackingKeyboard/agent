class NoneAction extends KeyAction implements Serializable<NoneAction> {

    fromJsObject(jsObject: any): NoneAction {
        this.assertKeyActionType(jsObject, KeyActionType.NoneAction, 'NoneAction');
        return this;
    }

    fromBinary(buffer: UhkBuffer): NoneAction {
        this.readAndAssertKeyActionId(buffer, KeyActionId.NoneAction, 'NoneAction');
        return this;
    }

    toJsObject(): any {
        return {
            keyActionType: KeyActionType.NoneAction
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.NoneAction);
    }
}

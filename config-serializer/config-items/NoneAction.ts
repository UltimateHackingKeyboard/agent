class NoneAction extends KeyAction {

    _fromJsObject(jsObject: any): NoneAction {
        this.assertKeyActionType(jsObject, KeyActionType.NoneAction, 'NoneAction');
        return this;
    }

    _fromBinary(buffer: UhkBuffer): NoneAction {
        this.readAndAssertKeyActionId(buffer, KeyActionId.NoneAction, 'NoneAction');
        return this;
    }

    _toJsObject(): any {
        return {
            keyActionType: KeyActionType.NoneAction
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.NoneAction);
    }

    toString(): string {
        return '<NoneAction>';
    }
}

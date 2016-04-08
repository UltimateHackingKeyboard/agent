class SwitchKeymapAction extends KeyAction {

    @assertUInt8
    keymapId: number;

    _fromJsObject(jsObject: any): SwitchKeymapAction {
        this.assertKeyActionType(jsObject, KeyActionType.SwitchKeymapAction, 'SwitchKeymapAction');
        this.keymapId = jsObject.keymapId;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): SwitchKeymapAction {
        this.readAndAssertKeyActionId(buffer, KeyActionId.SwitchKeymapAction, 'SwitchKeymapAction');
        this.keymapId = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            keyActionType: KeyActionType.SwitchKeymapAction,
            keymapId: this.keymapId
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.SwitchKeymapAction);
        buffer.writeUInt8(this.keymapId);
    }

    toString(): string {
        return `<SwitchKeymapAction keymapId="${this.keymapId}">`;
    }
}

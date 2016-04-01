class SwitchKeymapAction extends KeyAction implements Serializable<SwitchKeymapAction> {

    private _keymapId: number;

    get keymapId(): number {
        return this._keymapId;
    }

    set keymapId(value) {
        if (!TypeChecker.isUInt8Valid(value)) {
            throw `Invalid SwitchKeymapAction.keymapId: ${value}`;
        }
        this._keymapId = value;
    }

    fromJsObject(jsObject: any): SwitchKeymapAction {
        this.assertKeyActionType(jsObject, KeyActionType.SwitchKeymapAction, 'SwitchKeymapAction');
        this.keymapId = jsObject.keymapId;
        return this;
    }

    fromBinary(buffer: UhkBuffer): SwitchKeymapAction {
        this.readAndAssertKeyActionId(buffer, KeyActionId.SwitchKeymapAction, 'SwitchKeymapAction');
        this.keymapId = buffer.readUInt8();
        return this;
    }

    toJsObject(): any {
        return {
            keyActionType: KeyActionType.SwitchKeymapAction,
            keymapId: this.keymapId
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.SwitchKeymapAction);
        buffer.writeUInt8(this.keymapId);
    }
}

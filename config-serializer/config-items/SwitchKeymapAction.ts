class SwitchKeymapAction extends KeyAction implements Serializable<SwitchKeymapAction> {

    static keyActionTypeString = 'switchKeymap';

    private _keymapId: number;

    get keymapId(): number {
        return this._keymapId;
    }

    set keymapId(value) {
        if (!TypeChecker.isUInt8Valid(value)) {
            throw 'Invalid SwitchKeymapAction.keymapId: ${value}';
        }
        this._keymapId = value;
    }

    fromJsObject(jsObject: any): SwitchKeymapAction {
        this.keymapId = jsObject.keymapId;
        return this;
    }

    fromBinary(buffer: UhkBuffer): SwitchKeymapAction {
        this.keymapId = buffer.readUInt8();
        return this;
    }

    toJsObject(): any {
        return {
            keyActionType: SwitchKeymapAction.keyActionTypeString,
            keymapId: this.keymapId
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.SwitchKeymapAction);
        buffer.writeUInt8(this.keymapId);
    }
}

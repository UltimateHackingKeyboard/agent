class SwitchKeymapAction extends KeyAction implements Serializable<SwitchKeymapAction> {

    static keyActionTypeString = 'switchKeymap';
    static keyActionId = 246;

    private _keymapId: number;

    get keymapId(): number {
        return this._keymapId;
    }

    set keymapId(value) {
        if (!SwitchKeymapAction.isKeymapIdValid(value)) {
            throw 'Invalid SwitchKeymapAction.keymapId: ${value}';
        }
        this._keymapId = value;
    }

    static isKeymapIdValid(keymapId) {
        return 0 <= keymapId && keymapId <= 255;
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
        buffer.writeUInt8(SwitchKeymapAction.keyActionId);
        buffer.writeUInt8(this.keymapId);
    }
}

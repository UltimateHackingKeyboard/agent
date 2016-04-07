class PlayMacroAction extends KeyAction {

    private _macroId: number;

    get macroId(): number {
        return this._macroId;
    }

    set macroId(value) {
        this._macroId = value;
    }

    _fromJsObject(jsObject: any): PlayMacroAction {
        this.assertKeyActionType(jsObject, KeyActionType.PlayMacroAction, 'PlayMacroAction');
        this.macroId = jsObject.macroId;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): PlayMacroAction {
        this.readAndAssertKeyActionId(buffer, KeyActionId.PlayMacroAction, 'PlayMacroAction');
        this.macroId = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            keyActionType: KeyActionType.PlayMacroAction,
            macroId: this.macroId
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.PlayMacroAction);
        buffer.writeUInt8(this.macroId);
    }

    toString(): string {
        return `<PlayMacroAction macroId="${this.macroId}">`;
    }
}

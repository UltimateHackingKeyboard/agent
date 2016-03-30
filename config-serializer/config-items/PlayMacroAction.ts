class PlayMacroAction extends KeyAction implements Serializable<PlayMacroAction> {

    static keyActionTypeString = 'playMacro';

    private _macroId: number;

    get macroId(): number {
        return this._macroId;
    }

    set macroId(value) {
        if (!TypeChecker.isUInt8Valid(value)) {
            throw 'Invalid PlayMacroAction.macroId: ${value}';
        }
        this._macroId = value;
    }

    fromJsObject(jsObject: any): PlayMacroAction {
        if (jsObject.keyActionType !== PlayMacroAction.keyActionTypeString) {
            throw 'Invalid PlayMacroAction.keyActionType: "${jsObject.keyActionType}"';
        }

        this.macroId = jsObject.macroId;
        return this;
    }

    fromBinary(buffer: UhkBuffer): PlayMacroAction {
        let keyActionId = buffer.readUInt8();
        if (keyActionId !== KeyActionId.PlayMacroAction) {
            throw 'Invalid PlayMacroAction.keyActionId: ${keyActionId}';
        }

        this.macroId = buffer.readUInt8();
        return this;
    }

    toJsObject(): any {
        return {
            keyActionType: PlayMacroAction.keyActionTypeString,
            macroId: this.macroId
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.PlayMacroAction);
        buffer.writeUInt8(this.macroId);
    }
}

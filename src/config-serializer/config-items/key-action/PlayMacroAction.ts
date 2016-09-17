import { assertUInt8 } from '../../assert';
import { UhkBuffer } from '../../UhkBuffer';
import { KeyAction, KeyActionId, keyActionType } from './KeyAction';

export class PlayMacroAction extends KeyAction {

    @assertUInt8
    macroId: number;

    constructor(other?: PlayMacroAction) {
        super();
        if (!other) {
            return;
        }
        this.macroId = other.macroId;
    }

    _fromJsObject(jsObject: any): PlayMacroAction {
        this.assertKeyActionType(jsObject);
        this.macroId = jsObject.macroId;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): PlayMacroAction {
        this.readAndAssertKeyActionId(buffer);
        this.macroId = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            keyActionType: keyActionType.PlayMacroAction,
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

import { UhkBuffer } from '../../UhkBuffer';
import { Macro } from '../Macro';
import { KeyAction, KeyActionId, keyActionType } from './KeyAction';

export class PlayMacroAction extends KeyAction {

    macro: Macro;

    constructor(parameter?: PlayMacroAction | Macro) {
        super();
        if (!parameter) {
            return;
        }
        if (parameter instanceof PlayMacroAction) {
            this.macro = parameter.macro;
        } else {
            this.macro = parameter;
        }
    }

    fromJsonObject(jsonObject: any, macros: Macro[]): PlayMacroAction {
        this.assertKeyActionType(jsonObject);
        this.macro = macros.find(macro => macro.id === jsonObject.macroId);
        return this;
    }

    fromBinary(buffer: UhkBuffer, macros: Macro[]): PlayMacroAction {
        this.readAndAssertKeyActionId(buffer);
        const macroId = buffer.readUInt8();
        this.macro = macros.find(macro => macro.id === macroId);
        return this;
    }

    _toJsonObject(): any {
        return {
            keyActionType: keyActionType.PlayMacroAction,
            macroId: this.macro.id
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.PlayMacroAction);
        buffer.writeUInt8(this.macro.id);
    }

    toString(): string {
        return `<PlayMacroAction macroId="${this.macro.id}">`;
    }
}

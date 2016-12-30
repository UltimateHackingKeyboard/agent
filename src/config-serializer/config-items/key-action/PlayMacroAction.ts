import { assertUInt8 } from '../../assert';
import { UhkBuffer } from '../../UhkBuffer';
import { Macro } from '../Macro';
import { KeyAction, KeyActionId, keyActionType } from './KeyAction';

export class PlayMacroAction extends KeyAction {

    @assertUInt8
    macroId: number;

    constructor(parameter?: PlayMacroAction | Macro) {
        super();
        if (!parameter) {
            return;
        }
        if (parameter instanceof PlayMacroAction) {
            this.macroId = parameter.macroId;
        } else {
            this.macroId = parameter.id;
        }
    }

    fromJsonObject(jsonObject: any): PlayMacroAction {
        this.assertKeyActionType(jsonObject);
        this.macroId = jsonObject.macroId;
        return this;
    }

    fromBinary(buffer: UhkBuffer): PlayMacroAction {
        this.readAndAssertKeyActionId(buffer);
        this.macroId = buffer.readUInt8();
        return this;
    }

    _toJsonObject(): any {
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

import { assertUInt8 } from '../../assert';
import { UhkBuffer } from '../../uhk-buffer';
import { Macro } from '../macro';
import { KeyAction, KeyActionId, keyActionType } from './key-action';
import { UserConfiguration } from '../user-configuration';

export class PlayMacroAction extends KeyAction {

    @assertUInt8 macroId: number;

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

    fromJsonObject(jsonObject: any, macros: Macro[], version: number): PlayMacroAction {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
                this.fromJsonObjectV1(jsonObject, macros);
                break;

            default:
                throw new Error(`Play macro does not support version: ${version}`);
        }

        return this;
    }

    fromBinary(buffer: UhkBuffer, macros: Macro[], version: number): PlayMacroAction {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
                this.fromBinaryV1(buffer, macros);
                break;

            default:
                throw new Error(`Play macro action does not support version: ${version}`);
        }

        return this;
    }

    toJsonObject(macros: Macro[]): any {
        return {
            keyActionType: keyActionType.PlayMacroAction,
            macroIndex: macros.findIndex(macro => macro.id === this.macroId)
        };
    }

    toBinary(buffer: UhkBuffer, userConfiguration: UserConfiguration) {
        buffer.writeUInt8(KeyActionId.PlayMacroAction);
        buffer.writeUInt8(userConfiguration.macros.findIndex(macro => macro.id === this.macroId));
    }

    toString(): string {
        return `<PlayMacroAction macroId="${this.macroId}">`;
    }

    public getName(): string {
        return 'PlayMacroAction';
    }

    private fromJsonObjectV1(jsonObject: any, macros: Macro[]): PlayMacroAction {
        this.assertKeyActionType(jsonObject);
        this.macroId = macros[jsonObject.macroIndex].id;
        return this;
    }

    private fromBinaryV1(buffer: UhkBuffer, macros: Macro[]): PlayMacroAction {
        this.readAndAssertKeyActionId(buffer);
        const macroIndex = buffer.readUInt8();
        this.macroId = macros[macroIndex].id;
        return this;
    }
}

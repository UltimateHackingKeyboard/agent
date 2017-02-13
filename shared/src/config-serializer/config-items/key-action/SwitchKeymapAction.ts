import { UhkBuffer } from '../../UhkBuffer';
import { Keymap } from '../Keymap';
import { KeyAction, KeyActionId, keyActionType } from './KeyAction';

export class SwitchKeymapAction extends KeyAction {

    keymapAbbreviation: string;

    constructor(parameter?: SwitchKeymapAction | Keymap | string) {
        super();
        if (!parameter) {
            return;
        }
        if (parameter instanceof SwitchKeymapAction) {
            this.keymapAbbreviation = parameter.keymapAbbreviation;
        } else if (parameter instanceof Keymap) {
            this.keymapAbbreviation = parameter.abbreviation;
        } else {
            this.keymapAbbreviation = parameter;
        }
    }

    fromJsonObject(jsonObject: any): SwitchKeymapAction {
        this.assertKeyActionType(jsonObject);
        this.keymapAbbreviation = jsonObject.keymapAbbreviation;
        return this;
    }

    fromBinary(buffer: UhkBuffer): SwitchKeymapAction {
        this.readAndAssertKeyActionId(buffer);
        this.keymapAbbreviation = buffer.readString();
        return this;
    }

    toJsonObject(): any {
        return {
            keyActionType: keyActionType.SwitchKeymapAction,
            keymapAbbreviation: this.keymapAbbreviation
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.SwitchKeymapAction);
        buffer.writeString(this.keymapAbbreviation);
    }

    toString(): string {
        return `<SwitchKeymapAction keymapAbbreviation="${this.keymapAbbreviation}">`;
    }
}

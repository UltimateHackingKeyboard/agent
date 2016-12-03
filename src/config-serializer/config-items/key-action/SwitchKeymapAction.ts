import { UhkBuffer } from '../../UhkBuffer';
import { Keymap } from '../Keymap';
import { KeyAction, KeyActionId, keyActionType } from './KeyAction';

export class SwitchKeymapAction extends KeyAction {

    keymap: Keymap;

    constructor(parameter?: SwitchKeymapAction | Keymap) {
        super();
        if (!parameter) {
            return;
        }
        if (parameter instanceof SwitchKeymapAction) {
            this.keymap = parameter.keymap;
        } else {
            this.keymap = parameter;
        }
    }

    fromJsonObject(jsonObject: any, keymaps: Keymap[]): SwitchKeymapAction {
        this.assertKeyActionType(jsonObject);
        this.keymap = keymaps.find(keymap => keymap.abbreviation === jsonObject.keymapAbbreviation);
        return this;
    }

    fromBinary(buffer: UhkBuffer, keymaps: Keymap[]): SwitchKeymapAction {
        this.readAndAssertKeyActionId(buffer);
        const keymapAbbreviation = buffer.readString();
        this.keymap = keymaps.find(keymap => keymap.abbreviation === keymapAbbreviation);
        return this;
    }

    _toJsonObject(): any {
        return {
            keyActionType: keyActionType.SwitchKeymapAction,
            keymapAbbreviation: this.keymap.abbreviation
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.SwitchKeymapAction);
        buffer.writeString(this.keymap.abbreviation);
    }

    toString(): string {
        return `<SwitchKeymapAction keymapAbbreviation="${this.keymap.abbreviation}">`;
    }
}

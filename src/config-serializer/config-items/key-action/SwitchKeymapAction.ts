import { UhkBuffer } from '../../UhkBuffer';
import { KeyAction, KeyActionId, keyActionType } from './KeyAction';

export class SwitchKeymapAction extends KeyAction {

    keymapAbbreviation: string;

    constructor(other?: SwitchKeymapAction) {
        super();
        if (!other) {
            return;
        }
        this.keymapAbbreviation = other.keymapAbbreviation;
    }

    _fromJsObject(jsObject: any): SwitchKeymapAction {
        this.assertKeyActionType(jsObject);
        this.keymapAbbreviation = jsObject.keymapAbbreviation;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): SwitchKeymapAction {
        this.readAndAssertKeyActionId(buffer);
        this.keymapAbbreviation = buffer.readString();
        return this;
    }

    _toJsObject(): any {
        return {
            keyActionType: keyActionType.SwitchKeymapAction,
            keymapAbbreviation: this.keymapAbbreviation
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.SwitchKeymapAction);
        buffer.writeString(this.keymapAbbreviation);
    }

    toString(): string {
        return `<SwitchKeymapAction keymapAbbreviation="${this.keymapAbbreviation}">`;
    }
}

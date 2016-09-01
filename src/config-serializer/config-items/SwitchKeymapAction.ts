import {keyActionType, KeyActionId, KeyAction} from './KeyAction';
import {UhkBuffer} from '../UhkBuffer';
import {assertUInt8} from '../assert';

export class SwitchKeymapAction extends KeyAction {

    @assertUInt8
    keymapId: number;

    _fromJsObject(jsObject: any): SwitchKeymapAction {
        this.assertKeyActionType(jsObject);
        this.keymapId = jsObject.keymapId;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): SwitchKeymapAction {
        this.readAndAssertKeyActionId(buffer);
        this.keymapId = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            keyActionType: keyActionType.SwitchKeymapAction,
            keymapId: this.keymapId
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.SwitchKeymapAction);
        buffer.writeUInt8(this.keymapId);
    }

    toString(): string {
        return `<SwitchKeymapAction keymapId="${this.keymapId}">`;
    }
}

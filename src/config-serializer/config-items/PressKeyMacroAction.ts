import {assertUInt8} from '../assert';
import {UhkBuffer} from '../UhkBuffer';
import {MacroAction, MacroActionId, macroActionType} from './MacroAction';

export class PressKeyMacroAction extends MacroAction {

    @assertUInt8
    scancode: number;

    _fromJsObject(jsObject: any): PressKeyMacroAction {
        this.assertMacroActionType(jsObject);
        this.scancode = jsObject.scancode;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): PressKeyMacroAction {
        this.readAndAssertMacroActionId(buffer);
        this.scancode = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            macroActionType: macroActionType.PressKeyMacroAction,
            scancode: this.scancode
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.PressKeyMacroAction);
        buffer.writeUInt8(this.scancode);
    }

    toString(): string {
        return `<PressKeyMacroAction scancode="${this.scancode}">`;
    }
}

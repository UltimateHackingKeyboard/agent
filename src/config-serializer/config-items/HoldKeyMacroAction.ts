import {assertUInt8} from '../assert';
import {UhkBuffer} from '../UhkBuffer';
import {MacroAction, MacroActionId, macroActionType} from './MacroAction';

export class HoldKeyMacroAction extends MacroAction {

    @assertUInt8
    scancode: number;

    _fromJsObject(jsObject: any): HoldKeyMacroAction {
        this.assertMacroActionType(jsObject);
        this.scancode = jsObject.scancode;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): HoldKeyMacroAction {
        this.readAndAssertMacroActionId(buffer);
        this.scancode = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            macroActionType: macroActionType.HoldKeyMacroAction,
            scancode: this.scancode
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.HoldKeyMacroAction);
        buffer.writeUInt8(this.scancode);
    }

    toString(): string {
        return `<HoldKeyMacroAction scancode="${this.scancode}">`;
    }
}

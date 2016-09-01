import {assertUInt8} from '../assert';
import {UhkBuffer} from '../UhkBuffer';
import {MacroAction, MacroActionId, macroActionType} from './MacroAction';

export class ReleaseKeyMacroAction extends MacroAction {

    @assertUInt8
    scancode: number;

    _fromJsObject(jsObject: any): ReleaseKeyMacroAction {
        this.assertMacroActionType(jsObject);
        this.scancode = jsObject.scancode;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): ReleaseKeyMacroAction {
        this.readAndAssertMacroActionId(buffer);
        this.scancode = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            macroActionType: macroActionType.ReleaseKeyMacroAction,
            scancode: this.scancode
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.ReleaseKeyMacroAction);
        buffer.writeUInt8(this.scancode);
    }

    toString(): string {
        return `<ReleaseKeyMacroAction scancode="${this.scancode}">`;
    }
}

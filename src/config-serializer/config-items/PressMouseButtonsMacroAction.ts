import {MacroActionId, macroActionType} from './MacroAction';
import {MouseButtonMacroAction} from './MouseButtonMacroAction';
import {UhkBuffer} from '../UhkBuffer';
import {assertUInt8} from '../assert';

export class PressMouseButtonsMacroAction extends MouseButtonMacroAction {

    @assertUInt8
    mouseButtonsMask: number;

    _fromJsObject(jsObject: any): PressMouseButtonsMacroAction {
        this.assertMacroActionType(jsObject);
        this.mouseButtonsMask = jsObject.mouseButtonsMask;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): PressMouseButtonsMacroAction {
        this.readAndAssertMacroActionId(buffer);
        this.mouseButtonsMask = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            macroActionType: macroActionType.PressMouseButtonsMacroAction,
            mouseButtonsMask: this.mouseButtonsMask
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.PressMouseButtonsMacroAction);
        buffer.writeUInt8(this.mouseButtonsMask);
    }

    toString(): string {
        return `<PressMouseButtonsMacroAction mouseButtonsMask="${this.mouseButtonsMask}">`;
    }
}

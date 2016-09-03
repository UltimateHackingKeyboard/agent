import {MacroActionId, macroActionType} from './MacroAction';
import {MouseButtonMacroAction} from './MouseButtonMacroAction';
import {UhkBuffer} from '../UhkBuffer';
import {assertUInt8} from '../assert';

export class ReleaseMouseButtonsMacroAction extends MouseButtonMacroAction {

    @assertUInt8
    mouseButtonsMask: number;

    _fromJsObject(jsObject: any): ReleaseMouseButtonsMacroAction {
        this.assertMacroActionType(jsObject);
        this.mouseButtonsMask = jsObject.mouseButtonsMask;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): ReleaseMouseButtonsMacroAction {
        this.readAndAssertMacroActionId(buffer);
        this.mouseButtonsMask = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            macroActionType: macroActionType.ReleaseMouseButtonsMacroAction,
            mouseButtonsMask: this.mouseButtonsMask
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.ReleaseMouseButtonsMacroAction);
        buffer.writeUInt8(this.mouseButtonsMask);
    }

    toString(): string {
        return `<ReleaseMouseButtonsMacroAction mouseButtonsMask="${this.mouseButtonsMask}">`;
    }
}

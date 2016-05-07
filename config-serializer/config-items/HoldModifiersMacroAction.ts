import {UhkBuffer} from '../UhkBuffer';
import {MacroAction, MacroActionId, macroActionType} from './MacroAction';
import {assertUInt8} from '../assert';

export class HoldModifiersMacroAction extends MacroAction {

    @assertUInt8
    modifierMask: number;

    _fromJsObject(jsObject: any): HoldModifiersMacroAction {
        this.assertMacroActionType(jsObject);
        this.modifierMask = jsObject.modifierMask;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): HoldModifiersMacroAction {
        this.readAndAssertMacroActionId(buffer);
        this.modifierMask = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            macroActionType: macroActionType.HoldModifiersMacroAction,
            modifierMask: this.modifierMask
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.HoldModifiersMacroAction);
        buffer.writeUInt8(this.modifierMask);
    }

    toString(): string {
        return `<HoldModifiersMacroAction modifierMask="${this.modifierMask}">`;
    }
}

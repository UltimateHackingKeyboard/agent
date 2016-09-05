import {assertUInt8} from '../../assert';
import {UhkBuffer} from '../../UhkBuffer';
import {KeyModifiers} from '../KeyModifiers';
import {MacroAction, MacroActionId, macroActionType} from './MacroAction';

export class PressModifiersMacroAction extends MacroAction {

    @assertUInt8
    modifierMask: number;

    _fromJsObject(jsObject: any): PressModifiersMacroAction {
        this.assertMacroActionType(jsObject);
        this.modifierMask = jsObject.modifierMask;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): PressModifiersMacroAction {
        this.readAndAssertMacroActionId(buffer);
        this.modifierMask = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            macroActionType: macroActionType.PressModifiersMacroAction,
            modifierMask: this.modifierMask
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.PressModifiersMacroAction);
        buffer.writeUInt8(this.modifierMask);
    }

    toString(): string {
        return `<PressModifiersMacroAction modifierMask="${this.modifierMask}">`;
    }

    isModifierActive(modifier: KeyModifiers): boolean {
        return (this.modifierMask & modifier) > 0;
    }
}

import {assertUInt8} from '../../assert';
import {UhkBuffer} from '../../UhkBuffer';
import {KeyModifiers} from '../KeyModifiers';
import {MacroAction, MacroActionId, macroActionType} from './MacroAction';

export class ReleaseModifiersMacroAction extends MacroAction {

    @assertUInt8
    modifierMask: number;

    _fromJsObject(jsObject: any): ReleaseModifiersMacroAction {
        this.assertMacroActionType(jsObject);
        this.modifierMask = jsObject.modifierMask;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): ReleaseModifiersMacroAction {
        this.readAndAssertMacroActionId(buffer);
        this.modifierMask = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            macroActionType: macroActionType.ReleaseModifiersMacroAction,
            modifierMask: this.modifierMask
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.ReleaseModifiersMacroAction);
        buffer.writeUInt8(this.modifierMask);
    }

    toString(): string {
        return `<ReleaseModifiersMacroAction modifierMask="${this.modifierMask}">`;
    }

    isModifierActive(modifier: KeyModifiers): boolean {
        return (this.modifierMask & modifier) > 0;
    }
}

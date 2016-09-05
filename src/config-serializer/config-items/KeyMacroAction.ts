import { MacroAction, MacroActionId, macroActionType } from './MacroAction';
import { KeystrokeAction } from './KeystrokeAction';
import { KeyAction, keyActionType } from './KeyAction';
import { KeyModifiers } from './KeyModifiers';
import {UhkBuffer} from '../UhkBuffer';
import {assertUInt8} from '../assert';

export class KeyMacroAction extends MacroAction {
    scancode: number;
    @assertUInt8
    modifierMask: number;

    _fromJsObject(jsObject: any): MacroAction {
        this.assertMacroActionType(jsObject);
        this.macroActionType = jsObject.macroActionType;
        this.scancode = jsObject.scancode;
        this.modifierMask = jsObject.modifierMask;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): MacroAction {
        this.readAndAssertMacroActionId(buffer);
        if (this.isKeyAction()) {
            this.scancode = buffer.readUInt8();
        } else {
            this.modifierMask = buffer.readUInt8();
        }
        return this;
    }

    _toJsObject(): any {
        return {
            macroActionType: this.macroActionType,
            scancode: this.scancode,
            modifierMask: this.modifierMask
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(this.getActionId());
        const value = this.isKeyAction() ? this.scancode : this.modifierMask;
        buffer.writeUInt8(value);
    }

    getActionId() {
        switch (this.macroActionType) {
            case macroActionType.HoldKeyMacroAction:
                return MacroActionId.HoldKeyMacroAction;

            case macroActionType.ReleaseKeyMacroAction:
                return MacroActionId.ReleaseKeyMacroAction;

            case macroActionType.PressModifiersMacroAction:
                return MacroActionId.PressModifiersMacroAction;

            case macroActionType.HoldModifiersMacroAction:
                return MacroActionId.HoldModifiersMacroAction;

            case macroActionType.ReleaseModifiersMacroAction:
                return MacroActionId.ReleaseModifiersMacroAction;

            case macroActionType.PressKeyMacroAction:
                return MacroActionId.PressKeyMacroAction;
            default:
                throw new Error(`Invalid macroActionType "${macroActionType}", cannot get macroActionId`);
        }
    }

    isKeyAction(): boolean {
        const keyActions = [
            macroActionType.PressKeyMacroAction,
            macroActionType.HoldKeyMacroAction,
            macroActionType.ReleaseKeyMacroAction
        ];
        return keyActions.indexOf(this.macroActionType) !== -1;
    }

    isModifierAction(): boolean {
        const modifierActions = [
            macroActionType.PressModifiersMacroAction,
            macroActionType.HoldModifiersMacroAction,
            macroActionType.ReleaseModifiersMacroAction
        ];
        return modifierActions.indexOf(this.macroActionType) !== -1;
    }

    isModifierActive(modifier: KeyModifiers): boolean {
        return (this.modifierMask & modifier) > 0;
    }

    toKeyAction() {
        let data = this.toJsObject();
        data.keyActionType = keyActionType.KeystrokeAction;
        return new KeystrokeAction().fromJsObject(data);
    }

    fromKeyAction(keyAction: KeyAction) {
        let data = keyAction.toJsObject();
        this.scancode = data.scancode;
        this.modifierMask = data.modifierMask;
    }

    toString(): string {
        return `<KeyMacroAction scancode="${this.scancode}" modifierMask="${this.modifierMask}">`;
    }
}

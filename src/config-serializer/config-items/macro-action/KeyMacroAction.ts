import { assertEnum, assertUInt8 } from '../../assert';
import { UhkBuffer } from '../../UhkBuffer';
import { KeyModifiers } from '../KeyModifiers';
import { MacroAction, MacroActionId, MacroSubAction, macroActionType } from './MacroAction';

const NUM_OF_COMBINATIONS = 3; // Cases: scancode, modifer, both

interface JsObjectKeyMacroAction {
    macroActionType: string;
    action: string;
    scancode?: number;
    modifierMask?: number;
}

export class KeyMacroAction extends MacroAction {

    @assertEnum(MacroSubAction)
    action: MacroSubAction;

    @assertUInt8
    scancode: number;

    @assertUInt8
    modifierMask: number;

    _fromJsObject(jsObject: JsObjectKeyMacroAction): KeyMacroAction {
        this.assertMacroActionType(jsObject);
        this.action = MacroSubAction[jsObject.action];
        this.scancode = jsObject.scancode;
        this.modifierMask = jsObject.modifierMask;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): KeyMacroAction {
        let macroActionId: MacroActionId = this.readAndAssertMacroActionId(buffer);
        let keyMacroType: number = macroActionId - MacroActionId.KeyMacroAction;
        this.action = Math.floor(keyMacroType / NUM_OF_COMBINATIONS);
        keyMacroType %= NUM_OF_COMBINATIONS;
        if (keyMacroType % 2 === 0) {
            this.scancode = buffer.readUInt8();
        }
        if (keyMacroType !== 0) {
            this.modifierMask = buffer.readUInt8();
        }
        return this;
    }

    _toJsObject(): any {
        let jsObject: JsObjectKeyMacroAction = {
            macroActionType: macroActionType.KeyMacroAction,
            action: MacroSubAction[this.action]
        };

        if (this.hasScancode()) {
            jsObject.scancode = this.scancode;
        }

        if (this.hasModifiers()) {
            jsObject.modifierMask = this.modifierMask;
        }

        return jsObject;
    }

    _toBinary(buffer: UhkBuffer) {
        let keyMacroType: number = MacroActionId.KeyMacroAction;
        keyMacroType += NUM_OF_COMBINATIONS * this.action;

        if (this.hasModifiers()) {
            ++keyMacroType;
            if (this.hasScancode()) {
                ++keyMacroType;
            }
        }
        buffer.writeUInt8(keyMacroType);
        if (this.hasScancode()) {
            buffer.writeUInt8(this.scancode);
        }
        if (this.hasModifiers()) {
            buffer.writeUInt8(this.modifierMask);
        }
    }

    toString(): string {
        return `<KeyMacroAction action="${this.action}" scancode="${this.scancode}" modifierMask="${this.modifierMask}">`;
    }

    isModifierActive(modifier: KeyModifiers): boolean {
        return (this.modifierMask & modifier) > 0;
    }

    hasScancode(): boolean {
        return !!this.scancode;
    }

    hasModifiers(): boolean {
        return !!this.modifierMask;
    }

    isHoldAction(): boolean {
        return this.action === MacroSubAction.hold;
    }

    isPressAction(): boolean {
        return this.action === MacroSubAction.press;
    }

    isReleaseAction(): boolean {
        return this.action === MacroSubAction.release;
    }
}

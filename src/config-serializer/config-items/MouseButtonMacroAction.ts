import { MacroAction, MacroActionId, macroActionType } from './MacroAction';
import {UhkBuffer} from '../UhkBuffer';
import {assertUInt8} from '../assert';

export enum MouseButtons {
    Left = 1 << 0,
    Middle = 1 << 1,
    Right = 1 << 2
};

export class MouseButtonMacroAction extends MacroAction {
    @assertUInt8
    mouseButtonsMask: number;

    _fromJsObject(jsObject: any): MouseButtonMacroAction {
        this.assertMacroActionType(jsObject);
        this.macroActionType = jsObject.macroActionType;
        this.mouseButtonsMask = jsObject.mouseButtonsMask;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): MouseButtonMacroAction {
        this.readAndAssertMacroActionId(buffer);
        this.mouseButtonsMask = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            macroActionType: this.macroActionType,
            mouseButtonsMask: this.mouseButtonsMask
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(this.getActionId());
        buffer.writeUInt8(this.mouseButtonsMask);
    }

    setBitmask(values: boolean[]) {
        let bitmask = 0;
        for (let i = 0; i < values.length; i++) {
            const value = Number(values[i]);
            bitmask |= value << i;
        }
        this.mouseButtonsMask = bitmask;
    }

    bitMaskToBooleans() {
        let enabledMouseButtons: boolean[] = [];
        for (let bitmask = this.mouseButtonsMask; bitmask; bitmask >>>= 1) {
            enabledMouseButtons.push(Boolean(bitmask & 1));
        }
        return enabledMouseButtons;
    }

    getActionId() {
        switch (this.macroActionType) {
            case macroActionType.HoldMouseButtonsMacroAction:
                return MacroActionId.HoldMouseButtonsMacroAction;

            case macroActionType.ReleaseMouseButtonsMacroAction:
                return MacroActionId.ReleaseMouseButtonsMacroAction;

            case macroActionType.PressMouseButtonsMacroAction:
                return MacroActionId.PressMouseButtonsMacroAction;
            default:
                throw new Error(`Invalid macroActionType "${macroActionType}", cannot get macroActionId`);
        }
    }

    toString(): string {
        return `<MouseMacroAction mouseButtonsMask="${this.mouseButtonsMask}">`;
    }
}

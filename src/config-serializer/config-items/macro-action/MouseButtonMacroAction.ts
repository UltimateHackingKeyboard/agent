import { assertEnum, assertUInt8 } from '../../assert';
import { UhkBuffer } from '../../UhkBuffer';
import { MacroAction, MacroActionId, MacroSubAction, macroActionType } from './MacroAction';

export enum MouseButtons {
    Left = 1 << 0,
    Middle = 1 << 1,
    Right = 1 << 2
};

interface JsObjectMouseButtonMacroAction {
    macroActionType: string;
    action: string;
    mouseButtonsMask?: number;
}

export class MouseButtonMacroAction extends MacroAction {
    @assertEnum(MacroSubAction)
    action: MacroSubAction;

    @assertUInt8
    mouseButtonsMask: number;

    constructor(other?: MouseButtonMacroAction) {
        super();
        if (!other) {
            return;
        }
        this.action = other.action;
        this.mouseButtonsMask = other.mouseButtonsMask;
    }

    _fromJsObject(jsObject: JsObjectMouseButtonMacroAction): MouseButtonMacroAction {
        this.assertMacroActionType(jsObject);
        this.action = MacroSubAction[jsObject.action];
        this.mouseButtonsMask = jsObject.mouseButtonsMask;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): MouseButtonMacroAction {
        let macroActionId: MacroActionId = this.readAndAssertMacroActionId(buffer);
        this.action = macroActionId - MacroActionId.MouseButtonMacroAction;
        this.mouseButtonsMask = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            macroActionType: macroActionType.MouseButtonMacroAction,
            action: MacroSubAction[this.action],
            mouseButtonsMask: this.mouseButtonsMask
        };
    }

    _toBinary(buffer: UhkBuffer): void {
        buffer.writeUInt8(MacroActionId.MouseButtonMacroAction + this.action);
        buffer.writeUInt8(this.mouseButtonsMask);
    }

    setMouseButtons(buttonStates: boolean[]): void {
        let bitmask = 0;
        for (let i = 0; i < buttonStates.length; i++) {
            bitmask |= Number(buttonStates[i]) << i;
        }
        this.mouseButtonsMask = bitmask;
    }

    getMouseButtons(): boolean[] {
        let enabledMouseButtons: boolean[] = [];
        for (let bitmask = this.mouseButtonsMask; bitmask; bitmask >>>= 1) {
            enabledMouseButtons.push(Boolean(bitmask & 1));
        }
        return enabledMouseButtons;
    }

    toString(): string {
        return `<MouseButtonMacroAction mouseButtonsMask="${this.mouseButtonsMask}">`;
    }

    hasButtons(): boolean {
        return this.mouseButtonsMask !== 0;
    }

    isOnlyHoldAction(): boolean {
        return this.action === MacroSubAction.hold;
    }

    isOnlyPressAction(): boolean {
        return this.action === MacroSubAction.press;
    }

    isOnlyReleaseAction(): boolean {
        return this.action === MacroSubAction.release;
    }
}

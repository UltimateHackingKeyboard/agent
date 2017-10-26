import { assertEnum, assertUInt8 } from '../../assert';
import { UhkBuffer } from '../../uhk-buffer';
import { MacroAction, MacroActionId, MacroSubAction, macroActionType } from './macro-action';

export enum MouseButtons {
    Left = 1 << 0,
    Middle = 1 << 1,
    Right = 1 << 2
}

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

    fromJsonObject(jsObject: JsObjectMouseButtonMacroAction): MouseButtonMacroAction {
        this.assertMacroActionType(jsObject);
        this.action = MacroSubAction[jsObject.action];
        this.mouseButtonsMask = jsObject.mouseButtonsMask;
        return this;
    }

    fromBinary(buffer: UhkBuffer): MouseButtonMacroAction {
        const macroActionId: MacroActionId = this.readAndAssertMacroActionId(buffer);
        this.action = macroActionId - MacroActionId.MouseButtonMacroAction;
        this.mouseButtonsMask = buffer.readUInt8();
        return this;
    }

    toJsonObject(): any {
        return {
            macroActionType: macroActionType.MouseButtonMacroAction,
            action: MacroSubAction[this.action],
            mouseButtonsMask: this.mouseButtonsMask
        };
    }

    toBinary(buffer: UhkBuffer): void {
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
        const enabledMouseButtons: boolean[] = [];
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

    isOnlyTapAction(): boolean {
        return this.action === MacroSubAction.tap;
    }

    isOnlyReleaseAction(): boolean {
        return this.action === MacroSubAction.release;
    }

    public getName(): string {
        return 'MouseButtonMacroAction';
    }
}

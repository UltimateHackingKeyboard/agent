import { assertEnum, assertUInt8 } from '../../assert';
import { UhkBuffer } from '../../uhk-buffer';
import { MacroAction, MacroActionId, MacroMouseSubAction, macroActionType } from './macro-action';

export enum MouseButtons {
    Left = 0,
    Right = 1,
    Middle = 2
}

export interface JsObjectMouseButtonMacroAction {
    macroActionType: string;
    action: string;
    mouseButtonsMask?: number;
}

export class MouseButtonMacroAction extends MacroAction {
    @assertEnum(MacroMouseSubAction)
    action: MacroMouseSubAction;

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

    fromJsonObject(jsonObject: JsObjectMouseButtonMacroAction, version: number): MouseButtonMacroAction {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                this.fromJsonObjectV1(jsonObject);
                break;

            default:
                throw new Error(`Mouse button macro action does not support version: ${version}`);
        }

        return this;
    }

    fromBinary(buffer: UhkBuffer, version: number): MouseButtonMacroAction {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                this.fromBinaryV1(buffer);
                break;

            default:
                throw new Error(`Mouse button macro action does not support version: ${version}`);
        }

        return this;
    }

    toJsonObject(): any {
        return {
            macroActionType: macroActionType.MouseButtonMacroAction,
            action: MacroMouseSubAction[this.action],
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

    isOnlyClickAction(): boolean {
        return this.action === MacroMouseSubAction.click;
    }

    isOnlyHoldAction(): boolean {
        return this.action === MacroMouseSubAction.hold;
    }

    isOnlyReleaseAction(): boolean {
        return this.action === MacroMouseSubAction.release;
    }

    public getName(): string {
        return 'MouseButtonMacroAction';
    }

    private fromJsonObjectV1(jsObject: JsObjectMouseButtonMacroAction): void {
        this.assertMacroActionType(jsObject);
        this.action = MacroMouseSubAction[jsObject.action];
        this.mouseButtonsMask = jsObject.mouseButtonsMask;
    }

    private fromBinaryV1(buffer: UhkBuffer): void {
        const macroActionId: MacroActionId = this.readAndAssertMacroActionId(buffer);
        this.action = macroActionId - MacroActionId.MouseButtonMacroAction;
        this.mouseButtonsMask = buffer.readUInt8();
    }

}

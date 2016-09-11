import { KeyAction, KeystrokeAction, keyActionType } from '../key-action';
import { DelayMacroAction } from './DelayMacroAction';
import { KeyMacroAction } from './KeyMacroAction';
import { MacroAction, MacroSubAction, macroActionType } from './MacroAction';
import { MouseButtonMacroAction } from './MouseButtonMacroAction';
import { MoveMouseMacroAction } from './MoveMouseMacroAction';
import { ScrollMouseMacroAction } from './ScrollMouseMacroAction';
import { TextMacroAction } from './TextMacroAction';

interface JsObjectEditableMacroAction {
    macroActionType: string;
    action?: string;
    scancode?: number;
    modifierMask?: number;
    mouseButtonsMask?: number;
    x?: number;
    y?: number;
    delay?: number;
    text?: string;
}

export class EditableMacroAction {
    macroActionType: string;
    action: MacroSubAction;
    // Key macro action properties
    scancode: number;
    modifierMask: number;
    // Mouse macro action properties
    mouseButtonsMask: number;
    moveX: number;
    moveY: number;
    scrollX: number;
    scrollY: number;
    // Delay macro action properties
    delay: number;
    // Text macro action properties
    text: string;

    constructor(jsObject?: JsObjectEditableMacroAction) {
        if (!jsObject) {
            return;
        }

        this.macroActionType = jsObject.macroActionType;

        switch (this.macroActionType) {
            case macroActionType.KeyMacroAction:
                this.action = MacroSubAction[jsObject.action];
                this.scancode = jsObject.scancode;
                this.modifierMask = jsObject.modifierMask;
                break;
            case macroActionType.MouseButtonMacroAction:
                this.action = MacroSubAction[jsObject.action];
                this.mouseButtonsMask = jsObject.mouseButtonsMask;
                break;
            case macroActionType.MoveMouseMacroAction:
                this.moveX = jsObject.x;
                this.moveY = jsObject.y;
                break;
            case macroActionType.ScrollMouseMacroAction:
                this.scrollX = jsObject.x;
                this.scrollY = jsObject.y;
                break;
            case macroActionType.TextMacroAction:
                this.text = jsObject.text;
                break;
            case macroActionType.DelayMacroAction:
                this.delay = jsObject.delay;
                break;
            default:
                break;
        }
    }

    toJsObject(): any {
        return {
            macroActionType: this.macroActionType,
            action: this.action,
            delay: this.delay,
            text: this.text,
            scancode: this.scancode,
            modifierMask: this.modifierMask,
            mouseButtonsMask: this.mouseButtonsMask,
            mouseMove: {
                x: this.moveX,
                y: this.moveY
            },
            mouseScroll: {
                x: this.scrollX,
                y: this.scrollY
            }
        };
    }

    fromKeyAction(keyAction: KeyAction): void {
        let data = keyAction.toJsObject();
        this.scancode = data.scancode;
        this.modifierMask = data.modifierMask;
    }

    toKeystrokeAction(): KeystrokeAction {
        let data = this.toJsObject();
        data.keyActionType = keyActionType.KeystrokeAction;
        return <KeystrokeAction>(new KeystrokeAction().fromJsObject(data));
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

    toClass(): MacroAction {
        switch (this.macroActionType) {
            // Delay action
            case macroActionType.DelayMacroAction:
                return new DelayMacroAction().fromJsObject({
                    macroActionType: this.macroActionType,
                    delay: this.delay
                });
            // Text action
            case macroActionType.TextMacroAction:
                return new TextMacroAction().fromJsObject({
                    macroActionType: this.macroActionType,
                    text: this.text
                });
            // Keypress action
            case macroActionType.KeyMacroAction:
                return new KeyMacroAction().fromJsObject({
                    macroActionType: this.macroActionType,
                    action: MacroSubAction[this.action],
                    scancode: this.scancode,
                    modifierMask: this.modifierMask
                });
            // Mouse actions
            case macroActionType.MouseButtonMacroAction:
                return new MouseButtonMacroAction().fromJsObject({
                    macroActionType: this.macroActionType,
                    action: MacroSubAction[this.action],
                    mouseButtonsMask: this.mouseButtonsMask
                });
            case macroActionType.MoveMouseMacroAction:
                return new MoveMouseMacroAction().fromJsObject({
                    macroActionType: this.macroActionType,
                    x: this.moveX,
                    y: this.moveY
                });
            case macroActionType.ScrollMouseMacroAction:
                return new ScrollMouseMacroAction().fromJsObject({
                    macroActionType: this.macroActionType,
                    x: this.scrollX,
                    y: this.scrollY
                });
            default:
                throw new Error('Macro action type is missing or not implemented.');
        }
    }

    isKeyAction(): boolean {
        return this.macroActionType === macroActionType.KeyMacroAction;
    }

    isMouseButtonAction(): boolean {
        return this.macroActionType === macroActionType.MouseButtonMacroAction;
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

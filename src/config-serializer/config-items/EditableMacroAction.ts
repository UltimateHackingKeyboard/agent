import {MacroAction, macroActionType} from './MacroAction';
import {values as _values } from 'lodash';

import {KeyAction} from './KeyAction';
import {KeyMacroAction} from './KeyMacroAction';
import {DelayMacroAction} from './DelayMacroAction';
import {MouseButtonMacroAction} from './MouseButtonMacroAction';
import {MoveMouseMacroAction} from './MoveMouseMacroAction';
import {ScrollMouseMacroAction} from './ScrollMouseMacroAction';
import {TextMacroAction} from './TextMacroAction';

const macroActionTypeValues = _values(macroActionType);
const keyActions = [
    macroActionType.PressKeyMacroAction,
    macroActionType.HoldKeyMacroAction,
    macroActionType.ReleaseKeyMacroAction,
    macroActionType.HoldModifiersMacroAction,
    macroActionType.PressModifiersMacroAction,
    macroActionType.ReleaseModifiersMacroAction
];
const mouseButtonActions = [
    macroActionType.PressMouseButtonsMacroAction,
    macroActionType.HoldMouseButtonsMacroAction,
    macroActionType.ReleaseMouseButtonsMacroAction
];

export class EditableMacroAction extends MacroAction {
    macroActionType: string;
    scancode: number;
    modifierMask: number;
    mouseButtonsMask: number;
    moveX: number;
    moveY: number;
    scrollX: number;
    scrollY: number;
    delay: number;
    text: string;

    assertMacroActionType(jsObject: any) {
        if (macroActionTypeValues.indexOf(jsObject.macroActionType) === -1) {
            const classname: string = this.constructor.name;
            throw `Invalid ${classname}.macroActionType: ${jsObject.macroActionType}`;
        }
    }

    _fromJsObject(jsObject: any): EditableMacroAction {
        this.assertMacroActionType(jsObject);
        this.macroActionType = jsObject.macroActionType;

        switch (this.macroActionType) {
            case macroActionType.PressKeyMacroAction:
            case macroActionType.HoldKeyMacroAction:
            case macroActionType.ReleaseKeyMacroAction:
            case macroActionType.PressModifiersMacroAction:
            case macroActionType.HoldModifiersMacroAction:
            case macroActionType.ReleaseModifiersMacroAction:
                this.scancode = jsObject.scancode;
                this.modifierMask = jsObject.modifierMask;
                break;
            case macroActionType.PressMouseButtonsMacroAction:
            case macroActionType.HoldMouseButtonsMacroAction:
            case macroActionType.ReleaseMouseButtonsMacroAction:
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
        return this;
    }

    _fromBinary(): MacroAction {
        // Does nothing, just for compatibility with MacroAction
        return this;
    }

    fromKeyAction(keyAction: KeyAction) {
        let data = keyAction.toJsObject();
        this.scancode = data.scancode;
        this.modifierMask = data.modifierMask;
    }

    _toJsObject(): any {
        return {
            macroActionType: this.macroActionType,
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

    _toBinary() {
        // Does nothing, just for compatibility with MacroAction
    }

    setMouseButtons(buttonStates: boolean[]) {
        let bitmask = 0;
        buttonStates.forEach((enabled, idx) => {
            if (enabled) {
                bitmask |= 1 << idx;
            } else {
                bitmask &= ~1 << idx;
            }
        });
        console.log('mouse buttons set', bitmask);
        this.mouseButtonsMask = bitmask;
    }

    getMouseButtons() {
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
            // Keypress actions
            case macroActionType.PressKeyMacroAction:
            case macroActionType.HoldKeyMacroAction:
            case macroActionType.ReleaseKeyMacroAction:
            case macroActionType.HoldModifiersMacroAction:
            case macroActionType.PressModifiersMacroAction:
            case macroActionType.ReleaseModifiersMacroAction:
                return new KeyMacroAction().fromJsObject({
                    macroActionType: this.macroActionType,
                    scancode: this.scancode,
                    modifierMask: this.modifierMask
                });
            // Mouse actions
            case macroActionType.PressMouseButtonsMacroAction:
            case macroActionType.HoldMouseButtonsMacroAction:
            case macroActionType.ReleaseMouseButtonsMacroAction:
                return new MouseButtonMacroAction().fromJsObject({
                    macroActionType: this.macroActionType,
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
        return keyActions.indexOf(this.macroActionType) !== -1;
    }

    isMouseButtonAction(): boolean {
        return mouseButtonActions.indexOf(this.macroActionType) !== -1;
    }

    getActionId(): number {
        return -1;
    }

}

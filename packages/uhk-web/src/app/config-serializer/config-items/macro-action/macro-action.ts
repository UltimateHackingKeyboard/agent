import { UhkBuffer } from '../../uhk-buffer';

export enum MacroActionId {
    KeyMacroAction                  =  0,
    /*
        0 - 63 are reserved for KeyMacroAction
        2 bits for: PressKeyMacroAction / HoldKeyMacroAction / ReleaseKeyMacroAction / undefined
        2 bits for: with only scancode / only modifiers / both scancode and modifiers / undefined
        2 bits for: scancode type basic, short media, long media, system. It should be only used if scancode does exist.
    */
    LastKeyMacroAction              =  63,
    MouseButtonMacroAction          =  64,
    /*
        64 - 66 are reserved for MouseButtonMacroAction
        PressMouseButtonsMacroAction    = 64,
        HoldMouseButtonsMacroAction     = 65,
        ReleaseMouseButtonsMacroAction  = 66,
    */
    LastMouseButtonMacroAction      = 66,
    MoveMouseMacroAction            = 67,
    ScrollMouseMacroAction          = 68,
    DelayMacroAction                = 69,
    TextMacroAction                 = 70
}

export enum MacroSubAction {
    press = 0,
    hold = 1,
    release = 2
}

export let macroActionType = {
    KeyMacroAction                  : 'key',
    MouseButtonMacroAction          : 'mouseButton',
    MoveMouseMacroAction            : 'moveMouse',
    ScrollMouseMacroAction          : 'scrollMouse',
    DelayMacroAction                : 'delay',
    TextMacroAction                 : 'text'
};

export abstract class MacroAction {
    assertMacroActionType(jsObject: any) {
        const macroActionClassname = this.constructor.name;
        const macroActionTypeString = macroActionType[macroActionClassname];
        if (jsObject.macroActionType !== macroActionTypeString) {
            throw `Invalid ${macroActionClassname}.macroActionType: ${jsObject.macroActionType}`;
        }
    }

    readAndAssertMacroActionId(buffer: UhkBuffer): MacroActionId {
        const classname: string = this.constructor.name;
        const readMacroActionId: MacroActionId = buffer.readUInt8();
        const macroActionId: MacroActionId = MacroActionId[classname];
        if (macroActionId === MacroActionId.KeyMacroAction) {
            if (readMacroActionId < MacroActionId.KeyMacroAction || readMacroActionId > MacroActionId.LastKeyMacroAction) {
                throw `Invalid ${classname} first byte: ${readMacroActionId}`;
            }
        } else if (macroActionId === MacroActionId.MouseButtonMacroAction) {
            if (readMacroActionId < MacroActionId.MouseButtonMacroAction ||
                readMacroActionId > MacroActionId.LastMouseButtonMacroAction) {
                throw `Invalid ${classname} first byte: ${readMacroActionId}`;
            }
        } else if (readMacroActionId !== macroActionId) {
            throw `Invalid ${classname} first byte: ${readMacroActionId}`;
        }
        return readMacroActionId;
    }

    abstract toJsonObject(): any;
    abstract toBinary(buffer: UhkBuffer): void;
}

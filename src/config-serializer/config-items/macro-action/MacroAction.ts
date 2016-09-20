import { Serializable } from '../../Serializable';
import { UhkBuffer } from '../../UhkBuffer';

export enum MacroActionId {
    KeyMacroAction                  =  0,
    /*
        0 - 8 are reserved for KeyMacroAction
        PressKeyMacroAction with scancode:                  0
        PressKeyMacroAction with modifiers:                 1
        PressKeyMacroAction with scancode and modifiers     2
        HoldKeyMacroAction with scancode:                   3
        HoldKeyMacroAction with modifiers:                  4
        HoldKeyMacroAction with scancode and modifiers      5
        ReleaseKeyMacroAction with scancode:                6
        ReleaseKeyMacroAction with modifiers:               7
        ReleaseKeyMacroAction with scancode and modifiers   8
    */
    LastKeyMacroAction              =  8,
    MouseButtonMacroAction          =  9,
    /* 
        9 - 11 are reserved for MouseButtonMacroAction
        PressMouseButtonsMacroAction    =  9,
        HoldMouseButtonsMacroAction     = 10,
        ReleaseMouseButtonsMacroAction  = 11,
    */
    LastMouseButtonMacroAction      = 11,
    MoveMouseMacroAction            = 12,
    ScrollMouseMacroAction          = 13,
    DelayMacroAction                = 14,
    TextMacroAction                 = 15
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

export abstract class MacroAction extends Serializable<MacroAction> {
    assertMacroActionType(jsObject: any) {
        let macroActionClassname = this.constructor.name;
        let macroActionTypeString = macroActionType[macroActionClassname];
        if (jsObject.macroActionType !== macroActionTypeString) {
            throw `Invalid ${macroActionClassname}.macroActionType: ${jsObject.macroActionType}`;
        }
    }

    readAndAssertMacroActionId(buffer: UhkBuffer): MacroActionId {
        let classname: string = this.constructor.name;
        let readMacroActionId: MacroActionId = buffer.readUInt8();
        let macroActionId: MacroActionId = MacroActionId[classname];
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

    abstract _fromJsObject(jsObject: any): MacroAction;
    abstract _fromBinary(buffer: UhkBuffer): MacroAction;
    abstract _toJsObject(): any;
    abstract _toBinary(buffer: UhkBuffer): void;
}

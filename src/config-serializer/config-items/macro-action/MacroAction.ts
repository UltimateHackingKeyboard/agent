import {Serializable} from '../../Serializable';
import {UhkBuffer} from '../../UhkBuffer';

export enum MacroActionId {
    PressKeyMacroAction              =  0,
    HoldKeyMacroAction               =  1,
    ReleaseKeyMacroAction            =  2,
    PressModifiersMacroAction        =  3,
    HoldModifiersMacroAction         =  4,
    ReleaseModifiersMacroAction      =  5,
    PressMouseButtonsMacroAction     =  6,
    HoldMouseButtonsMacroAction      =  7,
    ReleaseMouseButtonsMacroAction   =  8,
    MoveMouseMacroAction             =  9,
    ScrollMouseMacroAction           = 10,
    DelayMacroAction                 = 11,
    TextMacroAction                  = 12
}

export let macroActionType = {
    PressKeyMacroAction              : 'pressKey',
    HoldKeyMacroAction               : 'holdKey',
    ReleaseKeyMacroAction            : 'releaseKey',
    PressModifiersMacroAction        : 'pressModifiers',
    HoldModifiersMacroAction         : 'holdModifiers',
    ReleaseModifiersMacroAction      : 'releaseModifiers',
    PressMouseButtonsMacroAction     : 'pressMouseButtons',
    HoldMouseButtonsMacroAction      : 'holdMouseButtons',
    ReleaseMouseButtonsMacroAction   : 'releaseMouseButtons',
    MoveMouseMacroAction             : 'moveMouse',
    ScrollMouseMacroAction           : 'scrollMouse',
    DelayMacroAction                 : 'delay',
    TextMacroAction                  : 'text'
};

let macroActionClassname = {
    KeyMacroAction: 'KeyMacroAction',
    MouseButtonMacroAction: 'MouseButtonMacroAction',
    MoveMouseMacroAction: 'MoveMouseMacroAction',
    ScrollMouseMacroAction: 'ScrollMouseMacroAction',
    TextMacroAction: 'TextMacroAction',
    DelayMacroAction: 'DelayMacroAction'
};

export abstract class MacroAction extends Serializable<MacroAction> {
    macroActionType: string;

    assertMacroActionType(jsObject: any) {
        const validMacroActionTypes: string[] = this.getValidMacroActionTypes();
        if (validMacroActionTypes.indexOf(jsObject.macroActionType) === -1) {
            const classname: string = this.constructor.name;
            throw `Invalid ${classname}.macroActionType: ${jsObject.macroActionType}`;
        }
    }

    getValidMacroActionTypes(): string[] {
        const classname: string = this.constructor.name;
        switch (classname) {
            case macroActionClassname.KeyMacroAction:
                return [
                    macroActionType.PressKeyMacroAction,
                    macroActionType.HoldKeyMacroAction,
                    macroActionType.ReleaseKeyMacroAction,
                    macroActionType.PressModifiersMacroAction,
                    macroActionType.HoldModifiersMacroAction,
                    macroActionType.ReleaseModifiersMacroAction
                ];
            case macroActionClassname.MouseButtonMacroAction:
                return [
                    macroActionType.PressMouseButtonsMacroAction,
                    macroActionType.HoldMouseButtonsMacroAction,
                    macroActionType.ReleaseMouseButtonsMacroAction
                ];
            case macroActionClassname.MoveMouseMacroAction:
                return [macroActionType.MoveMouseMacroAction];
            case macroActionClassname.ScrollMouseMacroAction:
                return [macroActionType.ScrollMouseMacroAction];
            case macroActionClassname.TextMacroAction:
                return [macroActionType.TextMacroAction];
            case macroActionClassname.DelayMacroAction:
                return [macroActionType.DelayMacroAction];
            default:
                throw new Error(`Invalid class name ${macroActionClassname}`);
        }
    }

    readAndAssertMacroActionId(buffer: UhkBuffer) {
        let classname: string = this.constructor.name;
        let readMacroActionId: number = buffer.readUInt8();
        let macroActionId: number = MacroActionId[classname];
        if (readMacroActionId !== macroActionId) {
            throw `Invalid ${classname} first byte: ${readMacroActionId}`;
        }
    }

    abstract _fromJsObject(jsObject: any): MacroAction;
    abstract _fromBinary(buffer: UhkBuffer): MacroAction;
    abstract _toJsObject(): any;
    abstract _toBinary(buffer: UhkBuffer): void;

}

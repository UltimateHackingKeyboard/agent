import {Serializable} from '../Serializable';
import {UhkBuffer} from '../UhkBuffer';

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

export abstract class MacroAction extends Serializable<MacroAction> {
    assertMacroActionType(jsObject: any) {
        let macroActionClassname = this.constructor.name;
        let macroActionTypeString = macroActionType[macroActionClassname];
        if (jsObject.macroActionType !== macroActionTypeString) {
            throw `Invalid ${macroActionClassname}.macroActionType: ${jsObject.macroActionType}`;
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

    /**
     * Clone MacroAction for editing without changing original
     * @param {any} [obj] Object attribute to clone, should be left empty
     * @return {any}
     */
    /* tslint:disable:no-unused-variable */
    clone(obj: any = undefined): any {
         /* tslint:enable:no-unused-variable */
        let cloneObj: any = new (<any>this.constructor)();
        for (let attribute in this) {
            if (typeof this[attribute] === 'object') {
                cloneObj[attribute] = this.clone(this[attribute]);
            } else {
                cloneObj[attribute] = this[attribute];
            }
        }
        return cloneObj;
    }

    abstract _fromJsObject(jsObject: any): MacroAction;
    abstract _fromBinary(buffer: UhkBuffer): MacroAction;
    abstract _toJsObject(): any;
    abstract _toBinary(buffer: UhkBuffer): void;

}

/// <reference path="../../Function.d.ts" />

import { Macro } from '../Macro';
import { UhkBuffer } from '../../UhkBuffer';

export enum KeyActionId {
    NoneAction                   = 0,
    KeystrokeAction              = 1,
    /*
        1 - 7 are reserved for KeystrokeAction
        3 bits:
            1: Do we have scancode?
            2: Do we have modifiers?
            3: Do we have longpress?
    */
    LastKeystrokeAction          = 7, // TODO: remove this after refactoring the keyActionId check
    SwitchLayerAction            = 8,
    SwitchKeymapAction           = 9,
    MouseAction                  = 10,
    PlayMacroAction              = 11
}

export let keyActionType = {
    NoneAction                   : 'none',
    KeystrokeAction              : 'keystroke',
    SwitchLayerAction            : 'switchLayer',
    SwitchKeymapAction           : 'switchKeymap',
    MouseAction                  : 'mouse',
    PlayMacroAction              : 'playMacro'
};

export abstract class KeyAction {

    assertKeyActionType(jsObject: any): void {
        const keyActionClassname: string = this.constructor.name;
        const keyActionTypeString: string = keyActionType[keyActionClassname];
        if (jsObject.keyActionType !== keyActionTypeString) {
            throw `Invalid ${keyActionClassname}.keyActionType: ${jsObject.keyActionType}`;
        }
    }

    readAndAssertKeyActionId(buffer: UhkBuffer): KeyActionId {
        const classname: string = this.constructor.name;
        const readKeyActionId: number = buffer.readUInt8();
        const keyActionId: number = KeyActionId[classname];
        if (keyActionId === KeyActionId.KeystrokeAction) {
            if (readKeyActionId < KeyActionId.KeystrokeAction || readKeyActionId > KeyActionId.LastKeystrokeAction) {
                 throw `Invalid ${classname} first byte: ${readKeyActionId}`;
            }
        } else if (readKeyActionId !== keyActionId) {
            throw `Invalid ${classname} first byte: ${readKeyActionId}`;
        }
        return readKeyActionId;
    }

    abstract toJsonObject(macros?: Macro[]): any;
    abstract toBinary(buffer: UhkBuffer, macros?: Macro[]): any;

    renameKeymap(oldAbbr: string, newAbbr: string): KeyAction {
        return this;
    }
}

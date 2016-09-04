/// <reference path="../../Function.d.ts" />

import {Serializable} from '../../Serializable';
import {UhkBuffer} from '../../UhkBuffer';

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

export abstract class KeyAction extends Serializable<KeyAction> {

    assertKeyActionType(jsObject: any): void {
        let keyActionClassname: string = this.constructor.name;
        let keyActionTypeString: string = keyActionType[keyActionClassname];
        if (jsObject.keyActionType !== keyActionTypeString) {
            throw `Invalid ${keyActionClassname}.keyActionType: ${jsObject.keyActionType}`;
        }
    }

    readAndAssertKeyActionId(buffer: UhkBuffer): KeyActionId {
        let classname: string = this.constructor.name;
        let readKeyActionId: number = buffer.readUInt8();
        let keyActionId: number = KeyActionId[classname];
        if (keyActionId === KeyActionId.KeystrokeAction) {
            if (readKeyActionId < KeyActionId.KeystrokeAction || readKeyActionId > KeyActionId.LastKeystrokeAction) {
                 throw `Invalid ${classname} first byte: ${readKeyActionId}`;
            }
        } else if (readKeyActionId !== keyActionId) {
            throw `Invalid ${classname} first byte: ${readKeyActionId}`;
        }
        return readKeyActionId;
    }

    abstract _fromJsObject(jsObject: any): KeyAction;
    abstract _fromBinary(buffer: UhkBuffer): KeyAction;
    abstract _toJsObject(): any;
    abstract _toBinary(buffer: UhkBuffer): void;
}

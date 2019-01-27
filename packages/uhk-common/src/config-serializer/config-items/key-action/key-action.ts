import { Macro } from '../macro';
import { UhkBuffer } from '../../uhk-buffer';
import { UserConfiguration } from '../user-configuration';

export enum KeyActionId {
    NoneAction = 0,
    KeystrokeAction = 1,
    /*
        1 - 31 are reserved for KeystrokeAction
        5 bits:
            1: Do we have scancode?
            2: Do we have modifiers?
            3: Do we have secondaryRole?
            4-5: What kind of keystroke? (basic, short/long media, system)
    */
    LastKeystrokeAction = 31, // TODO: remove this after refactoring the keyActionId check
    SwitchLayerAction = 32,
    SwitchKeymapAction = 33,
    MouseAction = 34,
    PlayMacroAction = 35
}

export let keyActionType = {
    NoneAction: 'none',
    KeystrokeAction: 'keystroke',
    SwitchLayerAction: 'switchLayer',
    SwitchKeymapAction: 'switchKeymap',
    MouseAction: 'mouse',
    PlayMacroAction: 'playMacro'
};

export abstract class KeyAction {
    assertKeyActionType(jsObject: any): void {
        const keyActionClassname: string = this.getName();
        const keyActionTypeString: string = keyActionType[keyActionClassname];
        if (jsObject.keyActionType !== keyActionTypeString) {
            throw `Invalid ${keyActionClassname}.keyActionType: ${jsObject.keyActionType}`;
        }
    }

    readAndAssertKeyActionId(buffer: UhkBuffer): KeyActionId {
        const classname: string = this.getName();
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

    abstract toBinary(buffer: UhkBuffer, userConfiguration?: UserConfiguration): void;

    abstract getName(): string;

    renameKeymap(oldAbbr: string, newAbbr: string): KeyAction {
        return this;
    }
}

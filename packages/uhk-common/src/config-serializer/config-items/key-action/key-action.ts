import { RgbColorInterface } from '../../../models/index.js';
import { assertUInt8 } from '../../assert.js';
import { Macro } from '../macro.js';
import { UhkBuffer } from '../../uhk-buffer.js';
import { SerialisationInfo } from '../serialisation-info.js';
import { UserConfiguration } from '../user-configuration.js';

export enum KeyActionId {
    NoneAction                   = 0,
    KeystrokeAction              = 1,
    /*
        1 - 31 are reserved for KeystrokeAction
        5 bits:
            1: Do we have scancode?
            2: Do we have modifiers?
            3: Do we have secondaryRole?
            4-5: What kind of keystroke? (basic, short/long media, system)
    */
    LastKeystrokeAction          = 31, // TODO: remove this after refactoring the keyActionId check
    SwitchLayerAction            = 32,
    SwitchKeymapAction           = 33,
    MouseAction                  = 34,
    PlayMacroAction              = 35,
    ConnectionsAction            = 36,
    OtherAction                  = 37,
}

export let keyActionType = {
    NoneAction                   : 'none',
    KeystrokeAction              : 'keystroke',
    SwitchLayerAction            : 'switchLayer',
    SwitchKeymapAction           : 'switchKeymap',
    MouseAction                  : 'mouse',
    PlayMacroAction              : 'playMacro',
    ConnectionsAction            : 'connections',
    OtherAction                  : 'other',
};

export abstract class KeyAction implements RgbColorInterface {

    @assertUInt8 b = 255;
    @assertUInt8 g = 255;
    @assertUInt8 r = 255;

    protected constructor(keyAction?: RgbColorInterface) {
        this.b = keyAction?.b ?? 255;
        this.g = keyAction?.g ?? 255;
        this.r = keyAction?.r ?? 255;
    }

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

    abstract toJsonObject(serialisationInfo: SerialisationInfo, macros?: Macro[]): any;

    abstract toBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo, userConfiguration?: UserConfiguration): void;

    abstract getName(): string;

    renameKeymap(oldAbbr: string, newAbbr: string): KeyAction {
        return this;
    }

    rgbColorFromBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): void {
        if (serialisationInfo.isUserConfigContainsRgbColors) {
            this.r = buffer.readUInt8();
            this.g = buffer.readUInt8();
            this.b = buffer.readUInt8();
        }
    }

    rgbColorFromJson(jsonObject: any, serialisationInfo: SerialisationInfo): void {
        if (serialisationInfo.isUserConfigContainsRgbColors) {
            this.b = jsonObject.b;
            this.g = jsonObject.g;
            this.r = jsonObject.r;
        }
    }

    rgbColorToBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): void {
        if (serialisationInfo.isUserConfigContainsRgbColors) {
            buffer.writeUInt8(this.r);
            buffer.writeUInt8(this.g);
            buffer.writeUInt8(this.b);
        }
    }

    rgbColorToJson(serialisationInfo: SerialisationInfo): RgbColorInterface {
        if (serialisationInfo.isUserConfigContainsRgbColors) {
            return {
                b: this.b,
                g: this.g,
                r: this.r
            };
        }
    }
}

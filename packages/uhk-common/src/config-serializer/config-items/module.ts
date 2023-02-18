import { assertUInt8 } from '../assert.js';
import { UhkBuffer } from '../uhk-buffer.js';
import { KeyActionHelper, KeyAction, NoneAction, PlayMacroAction, SwitchKeymapAction } from './key-action/index.js';
import { Macro } from './macro.js';
import { RgbColor } from './rgb-color.js';
import { UserConfiguration } from './user-configuration.js';

export class Module {

    @assertUInt8 id: number;

    ledColors: RgbColor[];

    keyActions: KeyAction[] = [];

    constructor(other?: Module) {
        if (!other) {
            return;
        }
        this.id = other.id;
        this.keyActions = other.keyActions.map(keyAction => KeyActionHelper.createKeyAction(keyAction, null));
        this.ledColors = other.ledColors.map(color => new RgbColor(color));
    }

    fromJsonObject(jsonObject: any, macros: Macro[], version: number): Module {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                this.fromJsonObjectV1(jsonObject, macros, version);
                break;
            case 6:
                this.fromJsonObjectV6(jsonObject, macros, version);
                break;

            default:
                throw new Error(`Module configuration does not support version: ${version}`);
        }

        return this;
    }

    fromBinary(buffer: UhkBuffer, macros: Macro[], version: number): Module {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                this.fromBinaryV1(buffer, macros, version);
                break;
            case 6:
                this.fromBinaryV6(buffer, macros, version);
                break;

            default:
                throw new Error(`Module configuration does not support version: ${version}`);
        }

        return this;
    }

    toJsonObject(macros?: Macro[]): any {
        return {
            id: this.id,
            ledColors: this.ledColors.map(color => color.toJsonObject()),
            keyActions: this.keyActions.map(keyAction => {
                if (keyAction && (macros || !(keyAction instanceof PlayMacroAction || keyAction instanceof SwitchKeymapAction))) {
                    return keyAction.toJsonObject(macros);
                }
                return null;
            }),
        };
    }

    toBinary(buffer: UhkBuffer, userConfiguration: UserConfiguration): void {
        buffer.writeUInt8(this.id);

        const noneAction = new NoneAction();

        buffer.writeArray(this.keyActions, (uhkBuffer: UhkBuffer, keyAction: KeyAction) => {
            if (keyAction) {
                keyAction.toBinary(uhkBuffer, userConfiguration);
            } else {
                noneAction.toBinary(uhkBuffer);
            }
        });
        buffer.writeArray(this.ledColors, (uhkBuffer: UhkBuffer, color: RgbColor) => {
            color.toBinary(uhkBuffer);
        });
    }

    toString(): string {
        return `<Module id="${this.id}">`;
    }

    renameKeymap(oldAbbr: string, newAbbr: string): Module {
        let keyActions: KeyAction[];
        let keyActionModified = false;
        this.keyActions.forEach((keyAction, index) => {
            if (!keyAction) { return; }
            const newKeyAction = keyAction.renameKeymap(oldAbbr, newAbbr);
            if (newKeyAction !== keyAction) {
                if (!keyActionModified) {
                    keyActions = this.keyActions.slice();
                    keyActionModified = true;
                }
                keyActions[index] = newKeyAction;
            }
        });
        if (keyActionModified) {
            const newModule = Object.assign(new Module(), this);
            newModule.keyActions = keyActions;
            return newModule;
        }
        return this;
    }

    fromJsonObjectV1(jsonObject: any, macros: Macro[], version: number): void {
        this.id = jsonObject.id;
        this.keyActions = jsonObject.keyActions.map((keyAction: any) => {
            return KeyActionHelper.createKeyAction(keyAction, macros, version);
        });
    }

    fromJsonObjectV6(jsonObject: any, macros: Macro[], version: number): void {
        this.fromJsonObjectV1(jsonObject, macros, version);
        this.ledColors = jsonObject.ledColors.map(color => new RgbColor(color));
    }

    fromBinaryV1(buffer: UhkBuffer, macros: Macro[], version: number): void {
        this.id = buffer.readUInt8();
        const keyActionsLength: number = buffer.readCompactLength();
        this.keyActions = [];
        for (let i = 0; i < keyActionsLength; ++i) {
            this.keyActions.push(KeyActionHelper.createKeyAction(buffer, macros, version));
        }
    }

    fromBinaryV6(buffer: UhkBuffer, macros: Macro[], version: number): void {
        this.fromBinaryV1(buffer, macros, version);
        this.ledColors = [];
        const ledColorsLength: number = buffer.readCompactLength();
        for (let i = 0; i < ledColorsLength; ++i) {
            this.ledColors.push(new RgbColor({
                r: buffer.readUInt8(),
                g: buffer.readUInt8(),
                b: buffer.readUInt8()
            }));
        }

    }
}

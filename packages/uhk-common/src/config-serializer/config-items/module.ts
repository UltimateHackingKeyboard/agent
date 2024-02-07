import { assertUInt8 } from '../assert.js';
import { UhkBuffer } from '../uhk-buffer.js';
import { KeyActionHelper, KeyAction, NoneAction, PlayMacroAction, SwitchKeymapAction } from './key-action/index.js';
import { Macro } from './macro.js';
import { SerialisationInfo } from './serialisation-info.js';
import { UserConfiguration } from './user-configuration.js';

export class Module {

    @assertUInt8 id: number;

    keyActions: KeyAction[] = [];

    constructor(other?: Module) {
        if (!other) {
            return;
        }
        this.id = other.id;
        this.keyActions = other.keyActions.map(keyAction => KeyActionHelper.fromKeyAction(keyAction));
    }

    fromJsonObject(jsonObject: any, macros: Macro[], serialisationInfo: SerialisationInfo): Module {
        switch (serialisationInfo.userConfigMajorVersion) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                this.fromJsonObjectV1(jsonObject, macros, serialisationInfo);
                break;

            default:
                throw new Error(`Module configuration does not support version: ${serialisationInfo.userConfigMajorVersion}`);
        }

        return this;
    }

    fromBinary(buffer: UhkBuffer, macros: Macro[], serialisationInfo: SerialisationInfo): Module {
        switch (serialisationInfo.userConfigMajorVersion) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                this.fromBinaryV1(buffer, macros, serialisationInfo);
                break;

            default:
                throw new Error(`Module configuration does not support version: ${serialisationInfo.userConfigMajorVersion}`);
        }

        return this;
    }

    toJsonObject(serialisationInfo: SerialisationInfo, macros?: Macro[]): any {
        return {
            id: this.id,
            keyActions: this.keyActions.map(keyAction => {
                if (keyAction && (macros || !(keyAction instanceof PlayMacroAction || keyAction instanceof SwitchKeymapAction))) {
                    return keyAction.toJsonObject(serialisationInfo, macros);
                }
                return new NoneAction();
            })
        };
    }

    toBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo, userConfiguration: UserConfiguration): void {
        buffer.writeUInt8(this.id);

        const noneAction = new NoneAction();

        buffer.writeArray(this.keyActions, (uhkBuffer: UhkBuffer, keyAction: KeyAction) => {
            if (keyAction) {
                keyAction.toBinary(uhkBuffer, serialisationInfo, userConfiguration);
            } else {
                noneAction.toBinary(uhkBuffer, serialisationInfo);
            }
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

    fromJsonObjectV1(jsonObject: any, macros: Macro[], serialisationInfo: SerialisationInfo): void {
        this.id = jsonObject.id;
        this.keyActions = jsonObject.keyActions.map((keyAction: any) => {
            return KeyActionHelper.fromJSONObject(keyAction, macros, serialisationInfo);
        });
    }

    fromBinaryV1(buffer: UhkBuffer, macros: Macro[], serialisationInfo: SerialisationInfo): void {
        this.id = buffer.readUInt8();
        const keyActionsLength: number = buffer.readCompactLength();
        this.keyActions = [];
        for (let i = 0; i < keyActionsLength; ++i) {
            this.keyActions.push(KeyActionHelper.createKeyAction(buffer, macros, serialisationInfo));
        }
    }
}

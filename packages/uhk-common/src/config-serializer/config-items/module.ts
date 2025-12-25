import { assertUInt8 } from '../assert.js';
import { UhkBuffer } from '../uhk-buffer.js';
import {
    KeyActionHelper,
    KeyAction,
    NoneAction,
    MacroArgumentAction,
    PlayMacroAction,
    SwitchKeymapAction,
} from './key-action/index.js';
import { KeyLabelAction } from './key-action/key-label-action.js';
import { NoneBlockAction } from './key-action/none-block-action.js';
import { Macro } from './macro.js';
import { SerialisationInfo } from './serialisation-info.js';
import { UserConfiguration } from './user-configuration.js';

export const UHK_60_LEFT_MAX_KEY_ACTION_COUNT = 32;
export const UHK_60_RIGHT_MAX_KEY_ACTION_COUNT = 34;

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
            case 8:
            case 9:
            case 11:
            case 12:
            case 13:
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
            case 8:
            case 9:
            case 11:
            case 12:
            case 13:
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

                return new NoneAction().toJsonObject(serialisationInfo);
            })
        };
    }

    toBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo, userConfiguration: UserConfiguration): void {
        buffer.writeUInt8(this.id);
        buffer.writeCompactLength(this.getKeyActionsCount());

        const keyActions = this.getCompressedKeyActions()
        for (const keyAction of keyActions) {
            keyAction.toBinary(buffer, serialisationInfo, userConfiguration);
        }
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
        let lastKeyAction: KeyAction;
        let processedKeyActionsCount = 0

        while (processedKeyActionsCount < keyActionsLength) {
            const keyAction = KeyActionHelper.createKeyAction(buffer, macros, serialisationInfo)

            if (KeyLabelAction instanceof KeyLabelAction) {
                // TODO: implement it in other PR
                //  related to https://github.com/UltimateHackingKeyboard/agent/issues/2289
            }
            else if (keyAction instanceof MacroArgumentAction) {
                if (lastKeyAction instanceof PlayMacroAction) {
                    lastKeyAction.macroArguments.push(keyAction);
                }
                else {
                    throw Error(`${processedKeyActionsCount} key action is not PlayMacroAction`);
                }
            }
            else if (keyAction instanceof NoneBlockAction) {
                for (let i = 0; i < keyAction.blockCount; i++) {
                    const noneAction = new NoneAction();
                    noneAction.r = keyAction.r;
                    noneAction.g = keyAction.g;
                    noneAction.b = keyAction.b;

                    this.keyActions.push(noneAction);
                    processedKeyActionsCount++
                }
                // minus 1 because we add +1 at the end of the loop
                processedKeyActionsCount--
            }
            else {
                lastKeyAction = keyAction;
                this.keyActions.push(keyAction);
            }

            processedKeyActionsCount++
        }
    }

    getCompressedKeyActions(): KeyAction[] {
        const result: KeyAction[] = [];

        for (let i = 0; i < this.keyActions.length;) {
            const keyAction = this.keyActions[i] || new NoneAction();

            if (keyAction instanceof NoneAction) {
                let blockCount = 1

                for (let j = i + 1; j < this.keyActions.length; j++) {
                    const nextAction = this.keyActions[j] || new NoneAction();

                    if (nextAction instanceof NoneAction
                        && keyAction.r === nextAction.r
                        && keyAction.g === nextAction.g
                        && keyAction.b === nextAction.b) {
                        blockCount++;
                    }
                    else {
                        break
                    }
                }

                if (blockCount > 1) {
                    const noneBlockAction = new NoneBlockAction()
                    noneBlockAction.blockCount = blockCount;
                    noneBlockAction.r = keyAction.r;
                    noneBlockAction.g = keyAction.g;
                    noneBlockAction.b = keyAction.b;

                    result.push(noneBlockAction);

                    i += blockCount;
                }
                else {
                    result.push(keyAction)
                    i++;
                }
            }
            else {
                result.push(keyAction)
                i++;
            }
        }

        return result;
    }

    getKeyActionsCount(): number {
        let count  = 0

        for (const keyAction of this.keyActions) {
            count++;

            if (keyAction instanceof PlayMacroAction) {
                count += keyAction.macroArguments.length;
            }

            // TODO: Extend when implement KeyLabelAction
        }

        return count;
    }

}

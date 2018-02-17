import { assertEnum, assertUInt8 } from '../assert';
import { UhkBuffer } from '../uhk-buffer';
import { KeyActionHelper, KeyAction, NoneAction, PlayMacroAction, SwitchKeymapAction } from './key-action';
import { Macro } from './macro';
import { UserConfiguration } from './user-configuration';

export class Module {

    @assertUInt8
    id: number;

    keyActions: KeyAction[];

    constructor(other?: Module) {
        if (!other) {
            return;
        }
        this.id = other.id;
        this.keyActions = other.keyActions.map(keyAction => KeyActionHelper.createKeyAction(keyAction));
    }

    fromJsonObject(jsonObject: any, macros?: Macro[]): Module {
        this.id = jsonObject.id;
        this.keyActions = jsonObject.keyActions.map((keyAction: any) => {
            return KeyActionHelper.createKeyAction(keyAction, macros);
        });
        return this;
    }

    fromBinary(buffer: UhkBuffer, macros?: Macro[]): Module {
        this.id = buffer.readUInt8();
        const keyActionsLength: number = buffer.readCompactLength();
        this.keyActions = [];
        for (let i = 0; i < keyActionsLength; ++i) {
            this.keyActions.push(KeyActionHelper.createKeyAction(buffer, macros));
        }
        return this;
    }

    toJsonObject(macros?: Macro[]): any {
        return {
            id: this.id,
            keyActions: this.keyActions.map(keyAction => {
                if (keyAction && (macros || !(keyAction instanceof PlayMacroAction || keyAction instanceof SwitchKeymapAction))) {
                    return keyAction.toJsonObject(macros);
                }
                return null;
            })
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

}

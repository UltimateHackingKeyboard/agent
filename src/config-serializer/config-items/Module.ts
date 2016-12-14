import { assertEnum, assertUInt8 } from '../assert';
import { UhkBuffer } from '../UhkBuffer';
import { Helper as KeyActionHelper, KeyAction, NoneAction } from './key-action';
import { Keymap } from './Keymap';
import { Macro } from './Macro';

enum PointerRole {
    none,
    move,
    scroll
}

export class Module {

    @assertUInt8
    id: number;

    keyActions: KeyAction[];

    @assertEnum(PointerRole)
    pointerRole: PointerRole;

    constructor(other?: Module) {
        if (!other) {
            return;
        }
        this.id = other.id;
        this.keyActions = other.keyActions.map(keyAction => KeyActionHelper.createKeyAction(keyAction));
        this.pointerRole = other.pointerRole;
    }

    fromJsonObject(jsonObject: any): Module {
        this.id = jsonObject.id;
        this.pointerRole = PointerRole[<string>jsonObject.pointerRole];
        this.keyActions = jsonObject.keyActions.map((keyAction: any) => {
           return KeyActionHelper.createKeyAction(keyAction);
        });
        return this;
    }

    fromBinary(buffer: UhkBuffer): Module {
        this.id = buffer.readUInt8();
        this.pointerRole = buffer.readUInt8();
        let keyActionsLength: number = buffer.readCompactLength();
        this.keyActions = [];
        for (let i = 0; i < keyActionsLength; ++i) {
            this.keyActions.push(KeyActionHelper.createKeyAction(buffer));
        }
        return this;
    }

    toJsonObject(): any {
        return {
            id: this.id,
            pointerRole: PointerRole[this.pointerRole],
            keyActions: this.keyActions.map(keyAction => {
                if (keyAction) {
                    return keyAction.toJsonObject();
                }
            })
        };
    }

    toBinary(buffer: UhkBuffer): void {
        buffer.writeUInt8(this.id);
        buffer.writeUInt8(this.pointerRole);

        const noneAction = new NoneAction();

        const keyActions: KeyAction[] = this.keyActions.map(keyAction => {
            if (keyAction) {
                return keyAction;
            }
            return noneAction;
        });

        buffer.writeArray(keyActions);
    }

    toString(): string {
        return `<Module id="${this.id}" pointerRole="${this.pointerRole}">`;
    }

}

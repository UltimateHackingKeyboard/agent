import { assertEnum, assertUInt8 } from '../assert';
import { Serializable } from '../Serializable';
import { UhkBuffer } from '../UhkBuffer';
import { Helper as KeyActionHelper, KeyAction } from './key-action';

enum PointerRole {
    none,
    move,
    scroll
}

export class Module extends Serializable<Module> {

    @assertUInt8
    id: number;

    keyActions: KeyAction[];

    @assertEnum(PointerRole)
    private pointerRole: PointerRole;

    constructor(other?: Module) {
        super();
        if (!other) {
            return;
        }
        this.id = other.id;
        this.keyActions = other.keyActions.map(keyAction => KeyActionHelper.createKeyAction(keyAction));
        this.pointerRole = other.pointerRole;
    }
    _fromJsObject(jsObject: any): Module {
        this.id = jsObject.id;
        this.pointerRole = PointerRole[<string>jsObject.pointerRole];
        this.keyActions = jsObject.keyActions.map((keyAction: any) => KeyActionHelper.createKeyAction(keyAction));
        return this;
    }

    _fromBinary(buffer: UhkBuffer): Module {
        this.id = buffer.readUInt8();
        this.pointerRole = buffer.readUInt8();
        let keyActionsLength: number = buffer.readCompactLength();
        this.keyActions = [];
        for (let i = 0; i < keyActionsLength; ++i) {
            this.keyActions.push(KeyActionHelper.createKeyAction(buffer));
        }
        return this;
    }

    _toJsObject(): any {
        return {
            id: this.id,
            pointerRole: PointerRole[this.pointerRole],
            keyActions: this.keyActions.map(keyAction => {
                if (keyAction) {
                    return keyAction.toJsObject();
                }
            })
        };
    }

    _toBinary(buffer: UhkBuffer): void {
        buffer.writeUInt8(this.id);
        buffer.writeUInt8(this.pointerRole);
        buffer.writeArray(this.keyActions);
    }

    toString(): string {
        return `<Module id="${this.id}" pointerRole="${this.pointerRole}">`;
    }

}

import {Serializable} from '../Serializable';
import {KeyActions} from './KeyActions';
import {UhkBuffer} from '../UhkBuffer';

enum PointerRole {
    none,
    move,
    scroll
}

export class Module extends Serializable<Module> {

    // @assertUInt8
    id: number;

    keyActions: KeyActions;

    // @assertEnum(PointerRole)
    private pointerRole: PointerRole;

    _fromJsObject(jsObject: any): Module {
        this.id = jsObject.id;
        this.pointerRole = PointerRole[<string> jsObject.pointerRole];
        this.keyActions = new KeyActions().fromJsObject(jsObject.keyActions);
        return this;
    }

    _fromBinary(buffer: UhkBuffer): Module {
        this.id = buffer.readUInt8();
        this.pointerRole = buffer.readUInt8();
        this.keyActions = new KeyActions().fromBinary(buffer);
        return this;
    }

    _toJsObject(): any {
        return {
            id: this.id,
            pointerRole: PointerRole[this.pointerRole],
            keyActions: this.keyActions.toJsObject()
        };
    }

    _toBinary(buffer: UhkBuffer): void {
        buffer.writeUInt8(this.id);
        buffer.writeUInt8(this.pointerRole);
        this.keyActions.toBinary(buffer);
    }

    toString(): string {
        return `<Module id="${this.id}" pointerRole="${this.pointerRole}">`;
    }

}

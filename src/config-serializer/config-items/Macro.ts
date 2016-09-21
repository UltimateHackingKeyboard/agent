import { assertUInt8 } from '../assert';
import { Serializable } from '../Serializable';
import { UhkBuffer } from '../UhkBuffer';
import { MacroActions } from './macro-action';

export class Macro extends Serializable<Macro> {

    @assertUInt8
    id: number;

    isLooped: boolean;

    isPrivate: boolean;

    name: string;

    macroActions: MacroActions;

    constructor(other?: Macro) {
        super();
        if (!other) {
            return;
        }
        this.id = other.id;
        this.isLooped = other.isLooped;
        this.isPrivate = other.isPrivate;
        this.name = other.name;
        this.macroActions = new MacroActions(other.macroActions);
    }

    _fromJsObject(jsObject: any): Macro {
        this.id = jsObject.id;
        this.isLooped = jsObject.isLooped;
        this.isPrivate = jsObject.isPrivate;
        this.name = jsObject.name;
        this.macroActions = new MacroActions().fromJsObject(jsObject.macroActions);
        return this;
    }

    _fromBinary(buffer: UhkBuffer): Macro {
        this.id = buffer.readUInt8();
        this.isLooped = buffer.readBoolean();
        this.isPrivate = buffer.readBoolean();
        this.name = buffer.readString();
        this.macroActions = new MacroActions().fromBinary(buffer);
        return this;
    }

    _toJsObject(): any {
        return {
            id: this.id,
            isLooped: this.isLooped,
            isPrivate: this.isPrivate,
            name: this.name,
            macroActions: this.macroActions.toJsObject()
        };
    }

    _toBinary(buffer: UhkBuffer): void {
        buffer.writeUInt8(this.id);
        buffer.writeBoolean(this.isLooped);
        buffer.writeBoolean(this.isPrivate);
        buffer.writeString(this.name);
        this.macroActions.toBinary(buffer);
    }

    toString(): string {
        return `<Macro id="${this.id}" name="${this.name}">`;
    }
}

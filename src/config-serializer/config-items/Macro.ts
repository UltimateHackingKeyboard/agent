import { assertUInt8 } from '../assert';
import { UhkBuffer } from '../UhkBuffer';
import { Helper as MacroActionHelper, MacroAction } from './macro-action';

export class Macro {

    @assertUInt8
    id: number;

    isLooped: boolean;

    isPrivate: boolean;

    name: string;

    macroActions: MacroAction[];

    constructor(other?: Macro) {
        if (!other) {
            return;
        }
        this.id = other.id;
        this.isLooped = other.isLooped;
        this.isPrivate = other.isPrivate;
        this.name = other.name;
        this.macroActions = other.macroActions.map(macroAction => MacroActionHelper.createMacroAction(macroAction));
    }

    fromJsonObject(jsonObject: any): Macro {
        this.id = jsonObject.id;
        this.isLooped = jsonObject.isLooped;
        this.isPrivate = jsonObject.isPrivate;
        this.name = jsonObject.name;
        this.macroActions = jsonObject.macroActions.map((macroAction: any) => MacroActionHelper.createMacroAction(macroAction));
        return this;
    }

    fromBinary(buffer: UhkBuffer): Macro {
        this.id = buffer.readUInt8();
        this.isLooped = buffer.readBoolean();
        this.isPrivate = buffer.readBoolean();
        this.name = buffer.readString();
        let macroActionsLength: number = buffer.readCompactLength();
        this.macroActions = [];
        for (let i = 0; i < macroActionsLength; ++i) {
            this.macroActions.push(MacroActionHelper.createMacroAction(buffer));
        }
        return this;
    }

    toJsonObject(): any {
        return {
            id: this.id,
            isLooped: this.isLooped,
            isPrivate: this.isPrivate,
            name: this.name,
            macroActions: this.macroActions.map(macroAction => macroAction.toJsonObject())
        };
    }

    toBinary(buffer: UhkBuffer): void {
        buffer.writeUInt8(this.id);
        buffer.writeBoolean(this.isLooped);
        buffer.writeBoolean(this.isPrivate);
        buffer.writeString(this.name);
        buffer.writeArray(this.macroActions);
    }

    toString(): string {
        return `<Macro id="${this.id}" name="${this.name}">`;
    }
}

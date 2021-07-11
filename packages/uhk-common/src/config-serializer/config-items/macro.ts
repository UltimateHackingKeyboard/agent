import { assertUInt8 } from '../assert';
import { UhkBuffer } from '../uhk-buffer';
import { MacroAction } from './macro-action';
import { Helper as MacroActionHelper } from './macro-action/helper';

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

    fromJsonObject(jsonObject: any, version: number): Macro {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                this.fromJsonObjectV1(jsonObject, version);
                break;

            default:
                throw new Error(`Macro configuration does not support version: ${version}`);
        }

        return this;
    }

    fromBinary(buffer: UhkBuffer, version: number): Macro {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                this.fromBinaryV1(buffer, version);
                break;

            default:
                throw new Error(`Macro configuration does not support version: ${version}`);
        }

        return this;
    }

    toJsonObject(): any {
        return {
            isLooped: this.isLooped,
            isPrivate: this.isPrivate,
            name: this.name,
            macroActions: this.macroActions.map(macroAction => macroAction.toJsonObject())
        };
    }

    toBinary(buffer: UhkBuffer): void {
        buffer.writeBoolean(this.isLooped);
        buffer.writeBoolean(this.isPrivate);
        buffer.writeString(this.name);
        buffer.writeArray(this.macroActions);
    }

    toString(): string {
        return `<Macro id="${this.id}" name="${this.name}">`;
    }

    private fromJsonObjectV1(jsonObject: any, version: number): void {
        this.isLooped = jsonObject.isLooped;
        this.isPrivate = jsonObject.isPrivate;
        this.name = jsonObject.name;
        this.macroActions = jsonObject.macroActions.map((macroAction: any) => {
            return MacroActionHelper.createMacroAction(macroAction, version);
        });
    }

    private fromBinaryV1(buffer: UhkBuffer, version: number): void {
        this.isLooped = buffer.readBoolean();
        this.isPrivate = buffer.readBoolean();
        this.name = buffer.readString();
        const macroActionsLength: number = buffer.readCompactLength();
        this.macroActions = [];
        for (let i = 0; i < macroActionsLength; ++i) {
            this.macroActions.push(MacroActionHelper.createMacroAction(buffer, version));
        }
    }
}

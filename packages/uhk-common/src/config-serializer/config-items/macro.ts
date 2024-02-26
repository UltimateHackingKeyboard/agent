import { assertUInt8 } from '../assert.js';
import { UhkBuffer } from '../uhk-buffer.js';
import { MacroAction } from './macro-action/macro-action.js';
import { Helper as MacroActionHelper } from './macro-action/helper.js';
import { SerialisationInfo } from './serialisation-info.js';

export class Macro {

    @assertUInt8 id: number;

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
        this.macroActions = other.macroActions.map(macroAction => MacroActionHelper.fromMacroAction(macroAction));
    }

    fromJsonObject(jsonObject: any, serialisationInfo: SerialisationInfo): Macro {
        switch (serialisationInfo.userConfigMajorVersion) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                this.fromJsonObjectV1(jsonObject, serialisationInfo);
                break;

            default:
                throw new Error(`Macro configuration does not support version: ${serialisationInfo.userConfigMajorVersion}`);
        }

        return this;
    }

    fromBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): Macro {
        switch (serialisationInfo.userConfigMajorVersion) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                this.fromBinaryV1(buffer, serialisationInfo);
                break;

            default:
                throw new Error(`Macro configuration does not support version: ${serialisationInfo.userConfigMajorVersion}`);
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

    private fromJsonObjectV1(jsonObject: any, serialisationInfo: SerialisationInfo): void {
        this.isLooped = jsonObject.isLooped;
        this.isPrivate = jsonObject.isPrivate;
        this.name = jsonObject.name;
        this.macroActions = jsonObject.macroActions.map((macroAction: any) => {
            return MacroActionHelper.createMacroAction(macroAction, serialisationInfo);
        });
    }

    private fromBinaryV1(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): void {
        this.isLooped = buffer.readBoolean();
        this.isPrivate = buffer.readBoolean();
        this.name = buffer.readString();
        const macroActionsLength: number = buffer.readCompactLength();
        this.macroActions = [];
        for (let i = 0; i < macroActionsLength; ++i) {
            this.macroActions.push(MacroActionHelper.createMacroAction(buffer, serialisationInfo));
        }
    }
}

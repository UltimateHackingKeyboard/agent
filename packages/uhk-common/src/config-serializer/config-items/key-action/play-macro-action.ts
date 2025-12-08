import { assertUInt8 } from '../../assert.js';
import { UhkBuffer } from '../../uhk-buffer.js';
import { Macro } from '../macro.js';
import { SerialisationInfo } from '../serialisation-info.js';
import { KeyAction, KeyActionId, keyActionType } from './key-action.js';
import { UserConfiguration } from '../user-configuration.js';

// Keep it in same file with PlayMacroAction to prevent circular
export class MacroArgumentAction extends KeyAction {

    value: string;

    constructor(other?: MacroArgumentAction) {
        super(other);

        if (other) {
            this.value = other.value;
        }
    }

    fromJsonObject(jsonObject: any): MacroArgumentAction {
        this.assertKeyActionType(jsonObject);
        this.value = jsonObject.value;

        return this;
    }

    fromBinary(buffer: UhkBuffer): MacroArgumentAction {
        this.readAndAssertKeyActionId(buffer);
        this.value = buffer.readString();

        return this;
    }

    toJsonObject(): any {
        return {
            keyActionType: keyActionType.MacroArgumentAction,
            value: this.value,
        };
    }

    toBinary(buffer: UhkBuffer): void {
        buffer.writeUInt8(KeyActionId.MacroArgumentAction);
        buffer.writeString(this.value);
    }

    toString(): string {
        return `<MacroArgumentAction value="${this.value}">`;
    }

    public getName(): string {
        return 'MacroArgumentAction';
    }
}

// Keep it in same file with MacroArgumentAction to prevent circular
export class PlayMacroAction extends KeyAction {

    @assertUInt8 macroId: number;

    macroArguments: MacroArgumentAction[];

    constructor(parameter?: PlayMacroAction | Macro) {
        if (!parameter) {
            super();
            this.macroArguments = [];
            return;
        }
        if (parameter instanceof PlayMacroAction) {
            super(parameter);
            if (Array.isArray(parameter.macroArguments)) {
                this.macroArguments = [...parameter.macroArguments];
            }
            this.macroId = parameter.macroId;
        } else {
            super();
            this.macroArguments = [];
            this.macroId = parameter.id;
        }
    }

    fromJsonObject(jsonObject: any, serialisationInfo: SerialisationInfo, macros: Macro[]): PlayMacroAction {
        switch (serialisationInfo.userConfigMajorVersion) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                this.fromJsonObjectV1(jsonObject, macros);
                break;

            case 6:
            case 7:
            case 8:
            case 9:
            case 11:
            case 12:
            case 13:
                this.fromJsonObjectV6(jsonObject, macros, serialisationInfo);
                break;

            default:
                throw new Error(`Play macro does not support version: ${serialisationInfo.userConfigMajorVersion}`);
        }

        return this;
    }

    fromBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo, macros: Macro[]): PlayMacroAction {
        switch (serialisationInfo.userConfigMajorVersion) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                this.fromBinaryV1(buffer, macros);
                break;

            case 6:
            case 7:
            case 8:
            case 9:
            case 11:
            case 12:
            case 13:
                this.fromBinaryV6(buffer, macros, serialisationInfo);
                break;

            default:
                throw new Error(`Play macro action does not support version: ${serialisationInfo.userConfigMajorVersion}`);
        }

        return this;
    }

    toJsonObject(serialisationInfo: SerialisationInfo, macros: Macro[]): any {
        return {
            keyActionType: keyActionType.PlayMacroAction,
            macroIndex: macros.findIndex(macro => macro.id === this.macroId),
            macroArguments: this.macroArguments.map(arg => arg.toJsonObject()),
            ...this.rgbColorToJson(serialisationInfo)
        };
    }

    toBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo, userConfiguration: UserConfiguration) {
        buffer.writeUInt8(KeyActionId.PlayMacroAction);
        buffer.writeUInt8(userConfiguration.macros.findIndex(macro => macro.id === this.macroId));
        this.rgbColorToBinary(buffer, serialisationInfo);

        for (const macroArgument of this.macroArguments) {
            macroArgument.toBinary(buffer)
        }
    }

    toString(): string {
        return `<PlayMacroAction macroId="${this.macroId}">`;
    }

    public getName(): string {
        return 'PlayMacroAction';
    }

    private fromJsonObjectV1(jsonObject: any, macros: Macro[]): PlayMacroAction {
        this.assertKeyActionType(jsonObject);
        this.macroId = macros[jsonObject.macroIndex].id;
        return this;
    }

    private fromJsonObjectV6(jsonObject: any, macros: Macro[], serialisationInfo: SerialisationInfo): void {
        this.fromJsonObjectV1(jsonObject, macros);
        this.rgbColorFromJson(jsonObject, serialisationInfo);

        if (Array.isArray(jsonObject.macroArguments)) {
            this.macroArguments = jsonObject.macroArguments.map(macroArgument => {
                const argument = new MacroArgumentAction();
                argument.fromJsonObject(macroArgument);

                return argument;
            })
        }
    }

    private fromBinaryV1(buffer: UhkBuffer, macros: Macro[]): PlayMacroAction {
        this.readAndAssertKeyActionId(buffer);
        const macroIndex = buffer.readUInt8();
        this.macroId = macros[macroIndex].id;
        return this;
    }

    private fromBinaryV6(buffer: UhkBuffer, macros: Macro[], serialisationInfo: SerialisationInfo): void {
        this.fromBinaryV1(buffer, macros);
        this.rgbColorFromBinary(buffer, serialisationInfo);
    }
}

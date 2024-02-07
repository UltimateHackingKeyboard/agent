import { UhkBuffer } from '../../uhk-buffer.js';
import { SerialisationInfo } from '../serialisation-info.js';
import { MacroAction, MacroActionId, macroActionType } from './macro-action.js';

export class TextMacroAction extends MacroAction {

    text: string;

    constructor(other?: TextMacroAction) {
        super();
        if (!other) {
            return;
        }
        this.text = other.text;
    }

    fromJsonObject(jsonObject: any, serialisationInfo: SerialisationInfo): TextMacroAction {
        switch (serialisationInfo.userConfigMajorVersion) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                this.fromJsonObjectV1(jsonObject);
                break;

            default:
                throw new Error(`Text macro action does not support version: ${serialisationInfo.userConfigMajorVersion}`);
        }

        return this;
    }

    fromBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): TextMacroAction {
        switch (serialisationInfo.userConfigMajorVersion) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                this.fromBinaryV1(buffer);
                break;

            default:
                throw new Error(`Text macro action does not support version: ${serialisationInfo.userConfigMajorVersion}`);
        }

        return this;
    }

    toJsonObject(): any {
        return {
            macroActionType: macroActionType.TextMacroAction,
            text: this.text
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.TextMacroAction);
        buffer.writeString(this.text);
    }

    toString(): string {
        return `<TextMacroAction text="${this.text}">`;
    }

    public getName(): string {
        return 'TextMacroAction';
    }

    private fromJsonObjectV1(jsObject: any): void {
        this.assertMacroActionType(jsObject);
        this.text = jsObject.text;
    }

    private fromBinaryV1(buffer: UhkBuffer): void {
        this.readAndAssertMacroActionId(buffer);
        this.text = buffer.readString();
    }
}

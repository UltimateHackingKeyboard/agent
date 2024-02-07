import { assertUInt16 } from '../../assert.js';
import { UhkBuffer } from '../../uhk-buffer.js';
import { SerialisationInfo } from '../serialisation-info.js';
import { MacroAction, MacroActionId, macroActionType } from './macro-action.js';

export class DelayMacroAction extends MacroAction {

    @assertUInt16 delay: number;

    constructor(other?: DelayMacroAction) {
        super();
        if (!other) {
            return;
        }
        this.delay = other.delay;
    }

    fromJsonObject(jsonObject: any, serialisationInfo: SerialisationInfo): DelayMacroAction {
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
                throw new Error(`Delay macro action does not support version: ${serialisationInfo.userConfigMajorVersion}`);
        }

        return this;
    }

    fromBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): DelayMacroAction {
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
                throw new Error(`Delay macro action does not support version: ${serialisationInfo.userConfigMajorVersion}`);
        }

        return this;
    }

    toJsonObject(): any {
        return {
            macroActionType: macroActionType.DelayMacroAction,
            delay: this.delay
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.DelayMacroAction);
        buffer.writeUInt16(this.delay);
    }

    toString(): string {
        return `<DelayMacroAction delay="${this.delay}">`;
    }

    public getName(): string {
        return 'DelayMacroAction';
    }

    private fromJsonObjectV1(jsObject: any): void {
        this.assertMacroActionType(jsObject);
        this.delay = jsObject.delay;
    }

    private fromBinaryV1(buffer: UhkBuffer): void {
        this.readAndAssertMacroActionId(buffer);
        this.delay = buffer.readUInt16();
    }
}

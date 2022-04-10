import { UhkBuffer } from '../../uhk-buffer.js';
import { MacroAction, MacroActionId, macroActionType } from './macro-action.js';

export class CommandMacroAction extends MacroAction {

    command: string;

    constructor(other?: CommandMacroAction) {
        super();
        if (!other) {
            return;
        }
        this.command = other.command;
    }

    fromJsonObject(jsonObject: any, version: number): CommandMacroAction {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                this.fromJsonObjectV1(jsonObject);
                break;

            default:
                throw new Error(`Command macro action does not support version: ${version}`);
        }

        return this;
    }

    fromBinary(buffer: UhkBuffer, version: number): CommandMacroAction {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                this.fromBinaryV1(buffer);
                break;

            default:
                throw new Error(`Command macro action does not support version: ${version}`);
        }

        return this;
    }

    toJsonObject(): any {
        return {
            macroActionType: macroActionType.CommandMacroAction,
            command: this.command
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.CommandMacroAction);
        buffer.writeString(this.command);
    }

    toString(): string {
        return `<CommandMacroAction command="${this.command}">`;
    }

    public getName(): string {
        return 'CommandMacroAction';
    }

    private fromJsonObjectV1(jsObject: any): void {
        this.assertMacroActionType(jsObject);
        this.command = jsObject.command;
    }

    private fromBinaryV1(buffer: UhkBuffer): void {
        this.readAndAssertMacroActionId(buffer);
        this.command = buffer.readString();
    }
}

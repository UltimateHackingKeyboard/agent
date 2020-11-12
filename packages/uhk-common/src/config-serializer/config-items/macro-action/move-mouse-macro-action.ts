import { assertInt16 } from '../../assert';
import { UhkBuffer } from '../../uhk-buffer';
import { MacroAction, MacroActionId, macroActionType } from './macro-action';

export class MoveMouseMacroAction extends MacroAction {

    @assertInt16
    x: number;

    @assertInt16
    y: number;

    constructor(other?: MoveMouseMacroAction) {
        super();
        if (!other) {
            return;
        }
        this.x = other.x;
        this.y = other.y;
    }

    fromJsonObject(jsonObject: any, version: number): MoveMouseMacroAction {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
                this.fromJsonObjectV1(jsonObject);
                break;

            default:
                throw new Error(`Mouse move macro action does not support version: ${version}`);
        }

        return this;
    }

    fromBinary(buffer: UhkBuffer, version: number): MoveMouseMacroAction {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
                this.fromBinaryV1(buffer);
                break;

            default:
                throw new Error(`Mouse move macro action does not support version: ${version}`);
        }

        return this;
    }

    toJsonObject(): any {
        return {
            macroActionType: macroActionType.MoveMouseMacroAction,
            x: this.x,
            y: this.y
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.MoveMouseMacroAction);
        buffer.writeInt16(this.x);
        buffer.writeInt16(this.y);
    }

    toString(): string {
        return `<MoveMouseMacroAction pos="(${this.x},${this.y})">`;
    }

    public getName(): string {
        return 'MoveMouseMacroAction';
    }

    private fromJsonObjectV1(jsObject: any): void {
        this.assertMacroActionType(jsObject);
        this.x = jsObject.x;
        this.y = jsObject.y;
    }

    private fromBinaryV1(buffer: UhkBuffer): void {
        this.readAndAssertMacroActionId(buffer);
        this.x = buffer.readInt16();
        this.y = buffer.readInt16();
    }
}

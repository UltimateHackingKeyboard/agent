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

    fromJsonObject(jsObject: any): MoveMouseMacroAction {
        this.assertMacroActionType(jsObject);
        this.x = jsObject.x;
        this.y = jsObject.y;
        return this;
    }

    fromBinary(buffer: UhkBuffer): MoveMouseMacroAction {
        this.readAndAssertMacroActionId(buffer);
        this.x = buffer.readInt16();
        this.y = buffer.readInt16();
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
}

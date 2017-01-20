import { assertInt16 } from '../../assert';
import { UhkBuffer } from '../../UhkBuffer';
import { MacroAction, MacroActionId, macroActionType } from './MacroAction';

export class ScrollMouseMacroAction extends MacroAction {

    @assertInt16
    x: number;

    @assertInt16
    y: number;

    constructor(other?: ScrollMouseMacroAction) {
        super();
        if (!other) {
            return;
        }
        this.x = other.x;
        this.y = other.y;
    }

    fromJsonObject(jsObject: any): ScrollMouseMacroAction {
        this.assertMacroActionType(jsObject);
        this.x = jsObject.x;
        this.y = jsObject.y;
        return this;
    }

    fromBinary(buffer: UhkBuffer): ScrollMouseMacroAction {
        this.readAndAssertMacroActionId(buffer);
        this.x = buffer.readInt16();
        this.y = buffer.readInt16();
        return this;
    }

    toJsonObject(): any {
        return {
            macroActionType: macroActionType.ScrollMouseMacroAction,
            x: this.x,
            y: this.y
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.ScrollMouseMacroAction);
        buffer.writeInt16(this.x);
        buffer.writeInt16(this.y);
    }

    toString(): string {
        return `<ScrollMouseMacroAction pos="(${this.x},${this.y})">`;
    }
}

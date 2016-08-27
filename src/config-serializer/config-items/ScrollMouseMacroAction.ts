import {MacroAction, MacroActionId, macroActionType} from './MacroAction';
import {UhkBuffer} from '../UhkBuffer';
import {assertInt16} from '../assert';

export class ScrollMouseMacroAction extends MacroAction {

    @assertInt16
    x: number;

    @assertInt16
    y: number;

    _fromJsObject(jsObject: any): ScrollMouseMacroAction {
        this.assertMacroActionType(jsObject);
        this.x = jsObject.x;
        this.y = jsObject.y;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): ScrollMouseMacroAction {
        this.readAndAssertMacroActionId(buffer);
        this.x = buffer.readInt16();
        this.y = buffer.readInt16();
        return this;
    }

    _toJsObject(): any {
        return {
            macroActionType: macroActionType.ScrollMouseMacroAction,
            x: this.x,
            y: this.y
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.ScrollMouseMacroAction);
        buffer.writeInt16(this.x);
        buffer.writeInt16(this.y);
    }

    toString(): string {
        return `<ScrollMouseMacroAction pos="(${this.x},${this.y})">`;
    }
}

import { assertUInt16 } from '../../assert';
import { UhkBuffer } from '../../UhkBuffer';
import { MacroAction, MacroActionId, macroActionType } from './MacroAction';

export class DelayMacroAction extends MacroAction {

    @assertUInt16
    delay: number;

    constructor(other?: DelayMacroAction) {
        super();
        if (!other) {
            return;
        }
        this.delay = other.delay;
    }

    _fromJsObject(jsObject: any): DelayMacroAction {
        this.assertMacroActionType(jsObject);
        this.delay = jsObject.delay;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): DelayMacroAction {
        this.readAndAssertMacroActionId(buffer);
        this.delay = buffer.readUInt16();
        return this;
    }

    _toJsObject(): any {
        return {
            macroActionType: macroActionType.DelayMacroAction,
            delay: this.delay
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.DelayMacroAction);
        buffer.writeUInt16(this.delay);
    }

    toString(): string {
        return `<DelayMacroAction delay="${this.delay}">`;
    }
}

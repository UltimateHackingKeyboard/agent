import { assertUInt16 } from '../../assert';
import { UhkBuffer } from '../../uhk-buffer';
import { MacroAction, MacroActionId, macroActionType } from './macro-action';

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

    fromJsonObject(jsObject: any): DelayMacroAction {
        this.assertMacroActionType(jsObject);
        this.delay = jsObject.delay;
        return this;
    }

    fromBinary(buffer: UhkBuffer): DelayMacroAction {
        this.readAndAssertMacroActionId(buffer);
        this.delay = buffer.readUInt16();
        return this;
    }

    toJsonObject(): any {
        return {
            macroActionType: macroActionType.DelayMacroAction,
            delay: this.delay,
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
}

import {UhkBuffer} from '../../UhkBuffer';
import {MacroAction, MacroActionId, macroActionType} from './MacroAction';

export class TextMacroAction extends MacroAction {

    text: string;

    constructor() {
        super();
        this.macroActionType = macroActionType.TextMacroAction;
    }

    _fromJsObject(jsObject: any): TextMacroAction {
        this.assertMacroActionType(jsObject);
        this.text = jsObject.text;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): TextMacroAction {
        this.readAndAssertMacroActionId(buffer);
        this.text = buffer.readString();
        return this;
    }

    _toJsObject(): any {
        return {
            macroActionType: macroActionType.TextMacroAction,
            text: this.text
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.TextMacroAction);
        buffer.writeString(this.text);
    }

    toString(): string {
        return `<TextMacroAction text="${this.text}">`;
    }
}

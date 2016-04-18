class PressKeyAction extends MacroAction {

    // @assertUInt8
    scancode: number;

    _fromJsObject(jsObject: any): PressKeyAction {
        this.assertMacroActionType(jsObject);
        this.scancode = jsObject.scancode;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): PressKeyAction {
        this.readAndAssertMacroActionId(buffer);
        this.scancode = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            macroActionType: macroActionType.PressKeyAction,
            scancode: this.scancode
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.PressKeyAction);
        buffer.writeUInt8(this.scancode);
    }

    toString(): string {
        return `<PressKeyAction scancode="${this.scancode}">`;
    }
}

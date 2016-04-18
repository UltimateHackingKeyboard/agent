class HoldKeyAction extends MacroAction {

    // @assertUInt8
    scancode: number;

    _fromJsObject(jsObject: any): HoldKeyAction {
        this.assertMacroActionType(jsObject);
        this.scancode = jsObject.scancode;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): HoldKeyAction {
        this.readAndAssertMacroActionId(buffer);
        this.scancode = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            macroActionType: macroActionType.HoldKeyAction,
            scancode: this.scancode
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.HoldKeyAction);
        buffer.writeUInt8(this.scancode);
    }

    toString(): string {
        return `<HoldKeyAction scancode="${this.scancode}">`;
    }
}

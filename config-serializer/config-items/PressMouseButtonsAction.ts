class PressMouseButtonsAction extends MacroAction {

    // @assertUInt8
    mouseButtonsMask: number;

    _fromJsObject(jsObject: any): PressMouseButtonsAction {
        this.assertMacroActionType(jsObject);
        this.mouseButtonsMask = jsObject.mouseButtonsMask;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): PressMouseButtonsAction {
        this.readAndAssertMacroActionId(buffer);
        this.mouseButtonsMask = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            macroActionType: macroActionType.PressMouseButtonsAction,
            mouseButtonsMask: this.mouseButtonsMask
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.PressMouseButtonsAction);
        buffer.writeUInt8(this.mouseButtonsMask);
    }

    toString(): string {
        return `<PressMouseButtonsAction mouseButtonsMask="${this.mouseButtonsMask}">`;
    }
}

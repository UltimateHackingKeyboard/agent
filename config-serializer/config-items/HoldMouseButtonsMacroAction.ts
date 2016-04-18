class HoldMouseButtonsAction extends MacroAction {

    // @assertUInt8
    mouseButtonsMask: number;

    _fromJsObject(jsObject: any): HoldMouseButtonsAction {
        this.assertMacroActionType(jsObject);
        this.mouseButtonsMask = jsObject.mouseButtonsMask;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): HoldMouseButtonsAction {
        this.readAndAssertMacroActionId(buffer);
        this.mouseButtonsMask = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            macroActionType: macroActionType.HoldMouseButtonsAction,
            mouseButtonsMask: this.mouseButtonsMask
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.HoldMouseButtonsAction);
        buffer.writeUInt8(this.mouseButtonsMask);
    }

    toString(): string {
        return `<HoldMouseButtonsAction mouseButtonsMask="${this.mouseButtonsMask}">`;
    }
}

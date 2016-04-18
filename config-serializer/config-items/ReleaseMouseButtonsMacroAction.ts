class ReleaseMouseButtonsAction extends MacroAction {

    // @assertUInt8
    mouseButtonsMask: number;

    _fromJsObject(jsObject: any): ReleaseMouseButtonsAction {
        this.assertMacroActionType(jsObject);
        this.mouseButtonsMask = jsObject.mouseButtonsMask;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): ReleaseMouseButtonsAction {
        this.readAndAssertMacroActionId(buffer);
        this.mouseButtonsMask = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            macroActionType: macroActionType.ReleaseMouseButtonsAction,
            mouseButtonsMask: this.mouseButtonsMask
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.ReleaseMouseButtonsAction);
        buffer.writeUInt8(this.mouseButtonsMask);
    }

    toString(): string {
        return `<ReleaseMouseButtonsAction mouseButtonsMask="${this.mouseButtonsMask}">`;
    }
}

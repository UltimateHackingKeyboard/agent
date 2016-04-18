class ReleaseKeyAction extends MacroAction {

    // @assertUInt8
    scancode: number;

    _fromJsObject(jsObject: any): ReleaseKeyAction {
        this.assertMacroActionType(jsObject);
        this.scancode = jsObject.scancode;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): ReleaseKeyAction {
        this.readAndAssertMacroActionId(buffer);
        this.scancode = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            macroActionType: macroActionType.ReleaseKeyAction,
            scancode: this.scancode
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.ReleaseKeyAction);
        buffer.writeUInt8(this.scancode);
    }

    toString(): string {
        return `<ReleaseKeyAction scancode="${this.scancode}">`;
    }
}

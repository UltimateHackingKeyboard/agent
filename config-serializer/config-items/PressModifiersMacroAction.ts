class PressModifiersAction extends MacroAction {

    // @assertUInt8
    modifierMask: number;

    _fromJsObject(jsObject: any): PressModifiersAction {
        this.assertMacroActionType(jsObject);
        this.modifierMask = jsObject.modifierMask;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): PressModifiersAction {
        this.readAndAssertMacroActionId(buffer);
        this.modifierMask = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            macroActionType: macroActionType.PressModifiersAction,
            modifierMask: this.modifierMask
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.PressModifiersAction);
        buffer.writeUInt8(this.modifierMask);
    }

    toString(): string {
        return `<PressModifiersAction modifierMask="${this.modifierMask}">`;
    }
}

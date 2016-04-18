class HoldModifiersAction extends MacroAction {

    // @assertUInt8
    modifierMask: number;

    _fromJsObject(jsObject: any): HoldModifiersAction {
        this.assertMacroActionType(jsObject);
        this.modifierMask = jsObject.modifierMask;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): HoldModifiersAction {
        this.readAndAssertMacroActionId(buffer);
        this.modifierMask = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            macroActionType: macroActionType.HoldModifiersAction,
            modifierMask: this.modifierMask
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.HoldModifiersAction);
        buffer.writeUInt8(this.modifierMask);
    }

    toString(): string {
        return `<HoldModifiersAction modifierMask="${this.modifierMask}">`;
    }
}

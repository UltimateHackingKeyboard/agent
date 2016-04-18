class ReleaseModifiersAction extends MacroAction {

    // @assertUInt8
    modifierMask: number;

    _fromJsObject(jsObject: any): ReleaseModifiersAction {
        this.assertMacroActionType(jsObject);
        this.modifierMask = jsObject.modifierMask;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): ReleaseModifiersAction {
        this.readAndAssertMacroActionId(buffer);
        this.modifierMask = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            macroActionType: macroActionType.ReleaseModifiersAction,
            modifierMask: this.modifierMask
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.ReleaseModifiersAction);
        buffer.writeUInt8(this.modifierMask);
    }

    toString(): string {
        return `<ReleaseModifiersAction modifierMask="${this.modifierMask}">`;
    }
}

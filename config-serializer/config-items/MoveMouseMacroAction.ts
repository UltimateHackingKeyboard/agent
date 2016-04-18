class MoveMouseAction extends MacroAction {

    // @assertInt16
    x: number;

    // @assertInt16
    y: number;

    _fromJsObject(jsObject: any): MoveMouseAction {
        this.assertMacroActionType(jsObject);
        this.x = jsObject.x;
        this.y = jsObject.y;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): MoveMouseAction {
        this.readAndAssertMacroActionId(buffer);
        this.x = buffer.readInt16();
        this.y = buffer.readInt16();
        return this;
    }

    _toJsObject(): any {
        return {
            macroActionType: macroActionType.MoveMouseAction,
            x: this.x,
            y: this.y
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.MoveMouseAction);
        buffer.writeInt16(this.x);
        buffer.writeInt16(this.y);
    }

    toString(): string {
        return `<MoveMouseAction pos="(${this.x},${this.y})">`;
    }
}

class ScrollMouseAction extends MacroAction {

    // @assertInt16
    x: number;

    // @assertInt16
    y: number;

    _fromJsObject(jsObject: any): ScrollMouseAction {
        this.assertMacroActionType(jsObject);
        this.x = jsObject.x;
        this.y = jsObject.y;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): ScrollMouseAction {
        this.readAndAssertMacroActionId(buffer);
        this.x = buffer.readInt16();
        this.y = buffer.readInt16();
        return this;
    }

    _toJsObject(): any {
        return {
            macroActionType: macroActionType.ScrollMouseAction,
            x: this.x,
            y: this.y
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(MacroActionId.ScrollMouseAction);
        buffer.writeInt16(this.x);
        buffer.writeInt16(this.y);
    }

    toString(): string {
        return `<ScrollMouseAction pos="(${this.x},${this.y})">`;
    }
}

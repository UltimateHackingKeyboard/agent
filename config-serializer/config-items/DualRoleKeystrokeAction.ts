enum LongPressAction {
    leftCtrl,
    leftShift,
    leftAlt,
    leftSuper,
    rightCtrl,
    rightShift,
    rightAlt,
    rightSuper,
    mod,
    fn,
    mouse
}

class DualRoleKeystrokeAction extends KeyAction implements Serializable<DualRoleKeystrokeAction> {

    public scancode;

    private _longPressAction: LongPressAction;

    get longPressAction(): number {
        return this._longPressAction;
    }

    set longPressAction(value) {
        if (!this.isDualRoleKeystrokeActionValid(value)) {
            throw `Invalid DualRoleKeystrokeAction.longPressAction: ${value}`;
        }
        this._longPressAction = value;
    }

    isDualRoleKeystrokeActionValid(keyActionIdParam): boolean {
        return LongPressAction[keyActionIdParam] !== undefined;
    }

    fromJsObject(jsObject: any): DualRoleKeystrokeAction {
        this.assertKeyActionType(jsObject, KeyActionType.DualRoleKeystrokeAction, 'DualRoleKeystrokeAction');
        this.scancode = jsObject.scancode;
        this.longPressAction = jsObject.longPressAction;
        return this;
    }

    fromBinary(buffer: UhkBuffer): DualRoleKeystrokeAction {
        this.readAndAssertKeyActionId(buffer, KeyActionId.DualRoleKeystrokeAction, 'DualRoleKeystrokeAction');
        this.scancode = buffer.readUInt8();
        this.longPressAction = buffer.readUInt8();
        return this;
    }

    toJsObject(): any {
        return {
            keyActionType: KeyActionType.DualRoleKeystrokeAction,
            scancode: this.scancode,
            longPressAction: KeyActionId[this.longPressAction]
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.DualRoleKeystrokeAction);
        buffer.writeUInt8(this.scancode);
        buffer.writeUInt8(this.longPressAction);
    }
}

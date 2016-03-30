enum LongPressActionId {
    leftCtrl = 236, // KeyActionId.DualRoleActionLeftCtrl
    leftShift,
    leftAlt,
    leftSuper,
    rightCtrl,
    rightShift,
    rightAlt,
    rightSuper,
    mod,
    fn,
    mouse,
}

class DualRoleKeystrokeAction extends KeyAction implements Serializable<DualRoleKeystrokeAction> {
    static keyActionTypeString = 'dualRoleKeystroke';

    public scancode;

    private _longPressAction: LongPressActionId;

    get longPressAction(): number {
        return this._longPressAction;
    }

    set longPressAction(value) {
        if (!DualRoleKeystrokeAction.isDualRoleKeystrokeActionValid(value)) {
            throw 'Invalid DualRoleKeystrokeAction.longPressAction: ${value}';
        }
        this._longPressAction = value;
    }

    static isDualRoleKeystrokeActionValid(keyActionId): boolean {
        return LongPressActionId[keyActionId] !== undefined;
    }

    fromJsObject(jsObject: any): DualRoleKeystrokeAction {
        this.longPressAction = jsObject.longPressAction;
        this.scancode = jsObject.scancode;
        return this;
    }

    fromBinary(buffer: UhkBuffer): DualRoleKeystrokeAction {
        this.longPressAction = buffer.readUInt8();
        this.scancode = buffer.readUInt8();
        return this;
    }

    toJsObject(): any {
        return {
            keyActionType: DualRoleKeystrokeAction.keyActionTypeString,
            longPressAction: LongPressActionId[this.longPressAction],
            scancode: this.scancode
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(this.longPressAction);
        buffer.writeUInt8(this.scancode);
    }
}

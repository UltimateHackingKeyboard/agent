class KeystrokeModifiersAction extends KeyAction {

    @assertUInt8
    modifierMask: number;

    _fromJsObject(jsObject: any): KeystrokeModifiersAction {
        this.assertKeyActionType(
            jsObject, KeyActionType.KeystrokeModifiersAction, 'KeystrokeModifiersAction');
        this.modifierMask = jsObject.modifierMask;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): KeystrokeModifiersAction {
        this.readAndAssertKeyActionId(buffer, KeyActionId.KeystrokeModifiersAction, 'KeystrokeModifiersAction');
        this.modifierMask = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            keyActionType: KeyActionType.KeystrokeModifiersAction,
            modifierMask: this.modifierMask
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.KeystrokeModifiersAction);
        buffer.writeUInt8(this.modifierMask);
    }

    toString(): string {
        return `<KeystrokeModifiersAction modifierMask="${this.modifierMask}">`;
    }
}

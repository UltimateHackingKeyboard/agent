enum KeyLayer {
    mod,
    fn,
    mouse
}

class SwitchLayerAction extends KeyAction {

    static toggleFlag = 0x80;

    isLayerToggleable: boolean;

    // @assertEnum(KeyLayer)
    private layer: KeyLayer;

    _fromJsObject(jsObject: any): SwitchLayerAction {
        this.assertKeyActionType(jsObject);
        this.layer = KeyLayer[<string> jsObject.layer];
        this.isLayerToggleable = jsObject.toggle;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): SwitchLayerAction {
        this.readAndAssertKeyActionId(buffer);
        let layer = buffer.readUInt8();
        this.isLayerToggleable = (layer & SwitchLayerAction.toggleFlag) !== 0;
        this.layer = layer & ~SwitchLayerAction.toggleFlag; // Clear toggle bit.
        return this;
    }

    _toJsObject(): any {
        return {
            keyActionType: keyActionType.SwitchLayerAction,
            layer: KeyLayer[this.layer],
            toggle: this.isLayerToggleable
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.SwitchLayerAction);
        buffer.writeUInt8(this.layer | this.getToggleFlag());
    }

    toString(): string {
        return `<SwitchLayerAction layer="${this.layer}" toggle="${this.isLayerToggleable}">`;
    }

    private getToggleFlag() {
        return this.isLayerToggleable ? SwitchLayerAction.toggleFlag : 0;
    }
}

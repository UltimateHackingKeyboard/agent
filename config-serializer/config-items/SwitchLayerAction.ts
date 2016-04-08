enum Layer {
    mod,
    fn,
    mouse
}

class SwitchLayerAction extends KeyAction {

    static toggleFlag = 0x80;

    isLayerToggleable: boolean;

    @assertEnum(Layer)
    private layer: Layer;

    getToggleFlag() {
        return this.isLayerToggleable ? SwitchLayerAction.toggleFlag : 0;
    }

    _fromJsObject(jsObject: any): SwitchLayerAction {
        this.assertKeyActionType(jsObject, keyActionType.SwitchLayerAction, 'SwitchLayerAction');
        this.layer = Layer[<string> jsObject.layer];
        this.isLayerToggleable = jsObject.toggle;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): SwitchLayerAction {
        this.readAndAssertKeyActionId(buffer, KeyActionId.SwitchLayerAction, 'SwitchLayerAction');
        let layer = buffer.readUInt8();
        this.isLayerToggleable = (layer & SwitchLayerAction.toggleFlag) !== 0;
        layer &= ~SwitchLayerAction.toggleFlag; // Clear toggle bit.
        this.layer = layer;
        return this;
    }

    _toJsObject(): any {
        return {
            keyActionType: keyActionType.SwitchLayerAction,
            layer: Layer[this.layer],
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
}

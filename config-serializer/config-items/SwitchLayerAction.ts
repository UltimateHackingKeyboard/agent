enum LayerName {
    mod,
    fn,
    mouse
}

class SwitchLayerAction extends KeyAction {

    isLayerToggleable: boolean;

    // @assertEnum(LayerName)
    private layer: LayerName;

    _fromJsObject(jsObject: any): SwitchLayerAction {
        this.assertKeyActionType(jsObject);
        this.layer = LayerName[<string> jsObject.layer];
        this.isLayerToggleable = jsObject.toggle;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): SwitchLayerAction {
        this.readAndAssertKeyActionId(buffer);
        this.layer = buffer.readUInt8();
        this.isLayerToggleable = buffer.readBoolean();
        return this;
    }

    _toJsObject(): any {
        return {
            keyActionType: keyActionType.SwitchLayerAction,
            layer: LayerName[this.layer],
            toggle: this.isLayerToggleable
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.SwitchLayerAction);
        buffer.writeUInt8(this.layer);
        buffer.writeBoolean(this.isLayerToggleable);
    }

    toString(): string {
        return `<SwitchLayerAction layer="${this.layer}" toggle="${this.isLayerToggleable}">`;
    }
}

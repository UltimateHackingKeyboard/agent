class SwitchLayerAction extends KeyAction implements Serializable<SwitchLayerAction> {

    static keyActionTypeString = 'switchLayer';

    private _layer: number;

    get layer(): number {
        return this._layer;
    }

    set layer(value) {
        if (!TypeChecker.isUInt8Valid(value)) {
            throw 'Invalid SwitchLayerAction.layerId: ${value}';
        }
        this._layer = value;
    }

    fromJsObject(jsObject: any): SwitchLayerAction {
        this.assertKeyActionType(jsObject, SwitchLayerAction.keyActionTypeString, 'SwitchLayerAction');
        this.layer = jsObject.keymapId;
        return this;
    }

    fromBinary(buffer: UhkBuffer): SwitchLayerAction {
        this.readAndAssertKeyActionId(buffer, KeyActionId.SwitchLayerAction, 'SwitchLayerAction');
        this.layer = buffer.readUInt8();
        return this;
    }

    toJsObject(): any {
        return {
            keyActionType: SwitchLayerAction.keyActionTypeString,
            layer: this.layer
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.SwitchLayerAction);
        buffer.writeUInt8(this.layer);
    }
}

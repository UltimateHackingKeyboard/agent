function assertUInt8(target: any, key: string) {
    let val = this[key];
    if (delete this[key]) {
        Object.defineProperty(target, key, {
            get: function () {
                return val;
            },
            set: function (newVal) {
                if (newVal < 0 || newVal > 255) {
                    throw `Invalid ${target.constructor.name}.${key}: ${newVal} is not uint8`;
                }
                val = newVal;
            },
            enumerable: true,
            configurable: true
        });
    }
}

function assertEnum<E>(enumerated: E) {
    return function(target: any, key: string) {
        let val = this[key];
        if (delete this[key]) {
            Object.defineProperty(target, key, {
                get: function () {
                    return val;
                },
                set: function (newVal) {
                    if (enumerated[newVal] === undefined) {
                        throw `Invalid ${target.constructor.name}.${key}: ${newVal} is not enum`;
                    }
                    val = newVal;
                },
                enumerable: true,
                configurable: true
            });
        }
    }
}

enum Layer {
    mod,
    fn,
    mouse
}

class SwitchLayerAction extends KeyAction implements Serializable<SwitchLayerAction> {

    static keyActionTypeString = 'switchLayer';
    static toggleFlag = 0x80;

    isLayerToggleable: boolean;

    @assertEnum(Layer)
    private layer: Layer;
/*
    get layer(): number {
        return this._layer;
    }

    set layer(value) {
        if (!TypeChecker.isUInt8Valid(value)) {
            throw 'Invalid SwitchLayerAction.layerId: ${value}';
        }
        this._layer = value;
    }
*/
    getToggleFlag() {
        return this.isLayerToggleable ? SwitchLayerAction.toggleFlag : 0;
    }

    fromJsObject(jsObject: any): SwitchLayerAction {
        this.assertKeyActionType(jsObject, SwitchLayerAction.keyActionTypeString, 'SwitchLayerAction');
        this.layer = jsObject.layerId;
        this.isLayerToggleable = jsObject.toggle;
        return this;
    }

    fromBinary(buffer: UhkBuffer): SwitchLayerAction {
        this.readAndAssertKeyActionId(buffer, KeyActionId.SwitchLayerAction, 'SwitchLayerAction');
        this.layer = buffer.readUInt8();
        this.isLayerToggleable = (this.layer & SwitchLayerAction.toggleFlag) !== 0;
        this.layer &= ~SwitchLayerAction.toggleFlag; // Clear toggle bit.
        return this;
    }

    toJsObject(): any {
        return {
            keyActionType: SwitchLayerAction.keyActionTypeString,
            layer: this.layer,
            toggle: this.isLayerToggleable
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.SwitchLayerAction);
        buffer.writeUInt8(this.layer | this.getToggleFlag());
    }
}

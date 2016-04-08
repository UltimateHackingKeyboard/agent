class KeyActions extends ClassArray<KeyAction> {

    jsObjectToClass(jsObject: any): Serializable<KeyAction> {
        switch (jsObject.keyActionType) {
            case keyActionType.NoneAction:
                return new NoneAction().fromJsObject(jsObject);
            case keyActionType.KeystrokeAction:
                return new KeystrokeAction().fromJsObject(jsObject);
            case keyActionType.KeystrokeModifiersAction:
                return new KeystrokeModifiersAction().fromJsObject(jsObject);
            case keyActionType.KeystrokeWithModifiersAction:
                return new KeystrokeWithModifiersAction().fromJsObject(jsObject);
            case keyActionType.DualRoleKeystrokeAction:
                return new DualRoleKeystrokeAction().fromJsObject(jsObject);
            case keyActionType.SwitchLayerAction:
                return new SwitchLayerAction().fromJsObject(jsObject);
            case keyActionType.SwitchKeymapAction:
                return new SwitchKeymapAction().fromJsObject(jsObject);
            case keyActionType.MouseAction:
                return new MouseAction().fromJsObject(jsObject);
            case keyActionType.PlayMacroAction:
                return new PlayMacroAction().fromJsObject(jsObject);
            default:
                throw `Invalid KeyAction.keyActionType: "${jsObject.actionType}"`;
        }
    }

    binaryToClass(buffer: UhkBuffer): Serializable<KeyAction> {
        let keyActionFirstByte = buffer.readUInt8();
        buffer.backtrack();

        if (buffer.enableDump) {
            process.stdout.write(']\n');
            buffer.enableDump = false;
        }

        switch (keyActionFirstByte) {
            case KeyActionId.NoneAction:
                return new NoneAction().fromBinary(buffer);
            case KeyActionId.KeystrokeAction:
                return new KeystrokeAction().fromBinary(buffer);
            case KeyActionId.KeystrokeModifiersAction:
                return new KeystrokeModifiersAction().fromBinary(buffer);
            case KeyActionId.KeystrokeWithModifiersAction:
                return new KeystrokeWithModifiersAction().fromBinary(buffer);
            case KeyActionId.DualRoleKeystrokeAction:
                return new DualRoleKeystrokeAction().fromBinary(buffer);
            case KeyActionId.SwitchLayerAction:
                return new SwitchLayerAction().fromBinary(buffer);
            case KeyActionId.SwitchKeymapAction:
                return new SwitchKeymapAction().fromBinary(buffer);
            case KeyActionId.MouseAction:
                return new MouseAction().fromBinary(buffer);
            case KeyActionId.PlayMacroAction:
                return new PlayMacroAction().fromBinary(buffer);
            default:
                throw `Invalid KeyAction first byte: ${keyActionFirstByte}`;
        }
    }
}

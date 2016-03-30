// A KeyAction is composed of 2 bytes in the RAM of the UHK: id byte, and param byte.
// Id denotes the subclass of the KeyAction and param is subclass-specific.

enum KeyActionId {
    NoneAction                = 0,
    KeyStrokeActionFirst      = TypeChecker.firstValidScancode, // 1
    // Intermediary scancodes = 2 to 230
    KeyStrokeActionLast       = TypeChecker.lastValidScancode,   // 231
    SwitchLayerAction         = 232,
    SwitchKeymapAction        = 233,
    MouseAction               = 234,
    PlayMacroAction           = 235,
    DualRoleActionLeftCtrl    = 236,
    DualRoleActionLeftShift   = 237,
    DualRoleActionLeftAlt     = 238,
    DualRoleActionLeftSuper   = 239,
    DualRoleActionRightCtrl   = 240,
    DualRoleActionRightShift  = 241,
    DualRoleActionRightAlt    = 242,
    DualRoleActionRightSuper  = 243,
    DualRoleActionMod         = 244,
    DualRoleActionFn          = 245,
    DualRoleActionMouse       = 246
    // Let's leave space for further layers - additional actions should descend from 255
}

class KeyAction {

    static fromJsObject(jsObject: any): KeyAction {
        switch (jsObject.keyActionType) {
            case KeystrokeAction.keyActionTypeString:
                return new KeystrokeAction().fromJsObject(jsObject);
            case MouseAction.keyActionTypeString:
                return new MouseAction().fromJsObject(jsObject);
            case NoneAction.keyActionTypeString:
                return new NoneAction().fromJsObject(jsObject);
            default:
                throw 'Invalid KeyAction.keyActionType: "${jsObject.actionType}"';
        }
    }

    static fromBinary(buffer: UhkBuffer): KeyAction {
        let keyActionFirstByte = buffer.readUInt8();
        buffer.backtrack();

        if (TypeChecker.isScancodeValid(keyActionFirstByte)) {
            return new KeystrokeAction().fromBinary(buffer);
        } else if (keyActionFirstByte === KeyActionId.MouseAction) {
            return new MouseAction().fromBinary(buffer);
        } else if (keyActionFirstByte === KeyActionId.NoneAction) {
            return new NoneAction().fromBinary(buffer);
        } else {
            throw 'Invalid KeyAction first byte "${keyActionFirstByte}"';
        }
    }
}

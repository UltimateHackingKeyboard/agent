enum KeyActionId {
    NoneAction                   = 0,
    KeystrokeAction              = 1,
    KeystrokeModifiersAction     = 2,
    KeystrokeWithModifiersAction = 3,
    DualRoleKeystrokeAction      = 4,
    SwitchLayerAction            = 5,
    SwitchKeymapAction           = 6,
    MouseAction                  = 7,
    PlayMacroAction              = 8
}

let keyActionType = {
    NoneAction                   : 'none',
    KeystrokeAction              : 'keystroke',
    KeystrokeModifiersAction     : 'keystrokeModifiers',
    KeystrokeWithModifiersAction : 'keystrokeWithModifiers',
    DualRoleKeystrokeAction      : 'dualRoleKeystroke',
    SwitchLayerAction            : 'switchLayer',
    SwitchKeymapAction           : 'switchKeymap',
    MouseAction                  : 'mouse',
    PlayMacroAction              : 'playMacro'
};

abstract class KeyAction extends Serializable<KeyAction> {
    assertKeyActionType(jsObject: any) {
        let keyActionClassname = this.constructor.name;
        let keyActionTypeString = keyActionType[keyActionClassname]
        if (jsObject.keyActionType !== keyActionTypeString) {
            throw `Invalid ${keyActionClassname}.keyActionType: ${jsObject.keyActionType}`;
        }
    }

    readAndAssertKeyActionId(buffer: UhkBuffer) {
        let classname = this.constructor.name;
        let readKeyActionId = buffer.readUInt8();
        let keyActionId = KeyActionId[<string> classname];
        if (readKeyActionId !== keyActionId) {
            throw `Invalid ${classname} first byte: ${readKeyActionId}`;
        }
    }

    abstract _fromJsObject(jsObject: any): KeyAction;
    abstract _fromBinary(buffer: UhkBuffer): KeyAction;
    abstract _toJsObject(): any;
    abstract _toBinary(buffer: UhkBuffer): void;
}

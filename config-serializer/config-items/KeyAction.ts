// A KeyAction is composed of 3 bytes in the RAM and up to 3 bytes in the EEPROM of the UHK.
// The first byte denotes the subclass of the KeyAction and its length in the EEPROM.

enum KeyActionId {
    NoneAction                   = 0,
    KeystrokeAction              = 1,
    KeystrokeWithModifiersAction = 2,
    DualRoleKeystrokeAction      = 3,
    SwitchLayerAction            = 4,
    SwitchKeymapAction           = 5,
    MouseAction                  = 6,
    PlayMacroAction              = 7
}

let KeyActionType = {
    NoneAction                   : 'none',
    KeystrokeAction              : 'keystroke',
    KeystrokeWithModifiersAction : 'keystrokeWithModifiers',
    DualRoleKeystrokeAction      : 'dualRoleKeystroke',
    SwitchLayerAction            : 'switchLayer',
    SwitchKeymapAction           : 'switchKeymap',
    MouseAction                  : 'mouse',
    PlayMacroAction              : 'playMacro'
}

abstract class KeyAction extends Serializable<KeyAction> {
    assertKeyActionType(jsObject: any, keyActionTypeString: string, classname: string) {
        if (jsObject.keyActionType !== keyActionTypeString) {
            console.log(arguments.callee.prototype.name);
            throw `Invalid ${classname}.keyActionType: ${jsObject.keyActionType}`;
        }
    }

    readAndAssertKeyActionId(buffer: UhkBuffer, keyActionIdParam: KeyActionId, classname: string) {
        let readKeyActionId = buffer.readUInt8();
        if (readKeyActionId !== keyActionIdParam) {
            throw `Invalid ${classname} first byte: ${readKeyActionId}`;
        }
    }

    abstract _fromJsObject(jsObject: any): KeyAction;
    abstract _fromBinary(buffer: UhkBuffer): KeyAction;
    abstract _toJsObject(): any;
    abstract _toBinary(buffer: UhkBuffer): void;
}

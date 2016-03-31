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

abstract class KeyAction implements Serializable<KeyAction> {
    abstract fromJsObject(jsObject: any): KeyAction;
    abstract fromBinary(buffer: UhkBuffer): KeyAction;
    abstract toJsObject(): any;
    abstract toBinary(buffer: UhkBuffer);

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
}

enum MacroActionId {
    PressKeyAction              =  0,
    HoldKeyAction               =  1,
    ReleaseKeyAction            =  2,
    PressModifiersAction        =  3,
    HoldModifiersAction         =  4,
    ReleaseModifiersAction      =  5,
    PressMouseButtonsAction     =  6,
    HoldMouseButtonsAction      =  7,
    ReleaseMouseButtonsAction   =  8,
    MoveMouseAction             =  9,
    ScrollMouseAction           = 10,
    DelayAction                 = 11,
    TextAction                  = 12
}

let macroActionType = {
    PressKeyAction              : 'pressKey',
    HoldKeyAction               : 'holdKey',
    ReleaseKeyAction            : 'releaseKey',
    PressModifiersAction        : 'pressModifiers',
    HoldModifiersAction         : 'holdModifiers',
    ReleaseModifiersAction      : 'releaseModifiers',
    PressMouseButtonsAction     : 'pressMouseButtons',
    HoldMouseButtonsAction      : 'holdMouseButtons',
    ReleaseMouseButtonsAction   : 'releaseMouseButtons',
    MoveMouseAction             : 'moveMouse',
    ScrollMouseAction           : 'scrollMouse',
    DelayAction                 : 'delay',
    TextAction                  : 'text'
};

abstract class MacroAction extends Serializable<MacroAction> {
    assertMacroActionType(jsObject: any) {
        let macroActionClassname = this.constructor.name;
        let macroActionTypeString = macroActionType[macroActionClassname];
        if (jsObject.macroActionType !== macroActionTypeString) {
            throw `Invalid ${macroActionClassname}.macroActionType: ${jsObject.macroActionType}`;
        }
    }

    readAndAssertMacroActionId(buffer: UhkBuffer) {
        let classname = this.constructor.name;
        let readMacroActionId = buffer.readUInt8();
        let macroActionId = MacroActionId[<string> classname];
        if (readMacroActionId !== macroActionId) {
            throw `Invalid ${classname} first byte: ${readMacroActionId}`;
        }
    }

    abstract _fromJsObject(jsObject: any): MacroAction;
    abstract _fromBinary(buffer: UhkBuffer): MacroAction;
    abstract _toJsObject(): any;
    abstract _toBinary(buffer: UhkBuffer): void;
}

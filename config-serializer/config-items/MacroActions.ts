class MacroActions extends ClassArray<MacroAction> {

    jsObjectToClass(jsObject: any): Serializable<MacroAction> {
        switch (jsObject.macroActionType) {
            case macroActionType.PressKeyAction:
                return new PressKeyAction().fromJsObject(jsObject);
            case macroActionType.HoldKeyAction:
                return new HoldKeyAction().fromJsObject(jsObject);
            case macroActionType.ReleaseKeyAction:
                return new ReleaseKeyAction().fromJsObject(jsObject);
            case macroActionType.PressModifiersAction:
                return new PressModifiersAction().fromJsObject(jsObject);
            case macroActionType.HoldModifiersAction:
                return new HoldModifiersAction().fromJsObject(jsObject);
            case macroActionType.ReleaseModifiersAction:
                return new ReleaseModifiersAction().fromJsObject(jsObject);
            case macroActionType.PressMouseButtonsAction:
                return new PressMouseButtonsAction().fromJsObject(jsObject);
            case macroActionType.HoldMouseButtonsAction:
                return new HoldMouseButtonsAction().fromJsObject(jsObject);
            case macroActionType.ReleaseMouseButtonsAction:
                return new ReleaseMouseButtonsAction().fromJsObject(jsObject);
            case macroActionType.MoveMouseAction:
                return new MoveMouseAction().fromJsObject(jsObject);
            case macroActionType.ScrollMouseAction:
                return new ScrollMouseAction().fromJsObject(jsObject);
            default:
                throw `Invalid MacroAction.macroActionType: "${jsObject.macroActionType}"`;
        }
    }

    binaryToClass(buffer: UhkBuffer): Serializable<MacroAction> {
        let macroActionFirstByte = buffer.readUInt8();
        buffer.backtrack();

        if (buffer.enableDump) {
            process.stdout.write(']\n');
            buffer.enableDump = false;
        }

        switch (macroActionFirstByte) {
            case MacroActionId.PressKeyAction:
                return new PressKeyAction().fromBinary(buffer);
            case MacroActionId.HoldKeyAction:
                return new HoldKeyAction().fromBinary(buffer);
            case MacroActionId.ReleaseKeyAction:
                return new ReleaseKeyAction().fromBinary(buffer);
            case MacroActionId.PressModifiersAction:
                return new PressModifiersAction().fromBinary(buffer);
            case MacroActionId.HoldModifiersAction:
                return new HoldModifiersAction().fromBinary(buffer);
            case MacroActionId.ReleaseModifiersAction:
                return new ReleaseModifiersAction().fromBinary(buffer);
            case MacroActionId.PressMouseButtonsAction:
                return new PressMouseButtonsAction().fromBinary(buffer);
            case MacroActionId.HoldMouseButtonsAction:
                return new HoldMouseButtonsAction().fromBinary(buffer);
            case MacroActionId.ReleaseMouseButtonsAction:
                return new ReleaseMouseButtonsAction().fromBinary(buffer);
            case MacroActionId.MoveMouseAction:
                return new MoveMouseAction().fromBinary(buffer);
            case MacroActionId.ScrollMouseAction:
                return new ScrollMouseAction().fromBinary(buffer);
            default:
                throw `Invalid MacroAction first byte: ${macroActionFirstByte}`;
        }
    }
}

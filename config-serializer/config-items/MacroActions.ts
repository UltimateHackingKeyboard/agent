class MacroActions extends ClassArray<MacroAction> {

    jsObjectToClass(jsObject: any): Serializable<MacroAction> {
        switch (jsObject.macroActionType) {
            case macroActionType.PressKeyMacroAction:
                return new PressKeyMacroAction().fromJsObject(jsObject);
            case macroActionType.HoldKeyMacroAction:
                return new HoldKeyMacroAction().fromJsObject(jsObject);
            case macroActionType.ReleaseKeyMacroAction:
                return new ReleaseKeyMacroAction().fromJsObject(jsObject);
            case macroActionType.PressModifiersMacroAction:
                return new PressModifiersMacroAction().fromJsObject(jsObject);
            case macroActionType.HoldModifiersMacroAction:
                return new HoldModifiersMacroAction().fromJsObject(jsObject);
            case macroActionType.ReleaseModifiersMacroAction:
                return new ReleaseModifiersMacroAction().fromJsObject(jsObject);
            case macroActionType.PressMouseButtonsMacroAction:
                return new PressMouseButtonsMacroAction().fromJsObject(jsObject);
            case macroActionType.HoldMouseButtonsMacroAction:
                return new HoldMouseButtonsMacroAction().fromJsObject(jsObject);
            case macroActionType.ReleaseMouseButtonsMacroAction:
                return new ReleaseMouseButtonsMacroAction().fromJsObject(jsObject);
            case macroActionType.MoveMouseMacroAction:
                return new MoveMouseMacroAction().fromJsObject(jsObject);
            case macroActionType.ScrollMouseMacroAction:
                return new ScrollMouseMacroAction().fromJsObject(jsObject);
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
            case MacroActionId.PressKeyMacroAction:
                return new PressKeyMacroAction().fromBinary(buffer);
            case MacroActionId.HoldKeyMacroAction:
                return new HoldKeyMacroAction().fromBinary(buffer);
            case MacroActionId.ReleaseKeyMacroAction:
                return new ReleaseKeyMacroAction().fromBinary(buffer);
            case MacroActionId.PressModifiersMacroAction:
                return new PressModifiersMacroAction().fromBinary(buffer);
            case MacroActionId.HoldModifiersMacroAction:
                return new HoldModifiersMacroAction().fromBinary(buffer);
            case MacroActionId.ReleaseModifiersMacroAction:
                return new ReleaseModifiersMacroAction().fromBinary(buffer);
            case MacroActionId.PressMouseButtonsMacroAction:
                return new PressMouseButtonsMacroAction().fromBinary(buffer);
            case MacroActionId.HoldMouseButtonsMacroAction:
                return new HoldMouseButtonsMacroAction().fromBinary(buffer);
            case MacroActionId.ReleaseMouseButtonsMacroAction:
                return new ReleaseMouseButtonsMacroAction().fromBinary(buffer);
            case MacroActionId.MoveMouseMacroAction:
                return new MoveMouseMacroAction().fromBinary(buffer);
            case MacroActionId.ScrollMouseMacroAction:
                return new ScrollMouseMacroAction().fromBinary(buffer);
            default:
                throw `Invalid MacroAction first byte: ${macroActionFirstByte}`;
        }
    }
}

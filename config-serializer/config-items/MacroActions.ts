class MacroActions extends ClassArray<MacroAction> {

    jsObjectToClass(jsObject: any): Serializable<MacroAction> {
        switch (jsObject.macroActionType) {
            case macroActionType.PressKeyAction:
                return new PressKeyAction().fromJsObject(jsObject);
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
            default:
                throw `Invalid MacroAction first byte: ${macroActionFirstByte}`;
        }
    }
}

import { UhkBuffer } from '../../UhkBuffer';
import {
    DelayMacroAction,
    KeyMacroAction,
    MacroAction,
    MacroActionId,
    MouseButtonMacroAction,
    MoveMouseMacroAction,
    ScrollMouseMacroAction,
    TextMacroAction,
    macroActionType
} from './index';

export class Helper {

    static createMacroAction(source: MacroAction | UhkBuffer | any): MacroAction {
        if (source instanceof MacroAction) {
            return Helper.fromMacroAction(source);
        } else if (source instanceof UhkBuffer) {
            return Helper.fromUhkBuffer(source);
        } else {
            return Helper.fromJSONObject(source);
        }
    }

    private static fromUhkBuffer(buffer: UhkBuffer): MacroAction {
        let macroActionFirstByte = buffer.readUInt8();
        buffer.backtrack();

        if (macroActionFirstByte >= MacroActionId.KeyMacroAction && macroActionFirstByte <= MacroActionId.LastKeyMacroAction) {
            return new KeyMacroAction().fromBinary(buffer);
        } else if (
            macroActionFirstByte >= MacroActionId.MouseButtonMacroAction &&
            macroActionFirstByte <= MacroActionId.LastMouseButtonMacroAction
        ) {
            return new MouseButtonMacroAction().fromBinary(buffer);
        }
        switch (macroActionFirstByte) {
            case MacroActionId.MoveMouseMacroAction:
                return new MoveMouseMacroAction().fromBinary(buffer);
            case MacroActionId.ScrollMouseMacroAction:
                return new ScrollMouseMacroAction().fromBinary(buffer);
            case MacroActionId.DelayMacroAction:
                return new DelayMacroAction().fromBinary(buffer);
            case MacroActionId.TextMacroAction:
                return new TextMacroAction().fromBinary(buffer);
            default:
                throw `Invalid MacroAction first byte: ${macroActionFirstByte}`;
        }
    }

    private static fromMacroAction(macroAction: MacroAction): MacroAction {
        let newMacroAction: MacroAction;
        if (macroAction instanceof KeyMacroAction) {
            newMacroAction = new KeyMacroAction(macroAction);
        } else if (macroAction instanceof MouseButtonMacroAction) {
            newMacroAction = new MouseButtonMacroAction(macroAction);
        } else if (macroAction instanceof MoveMouseMacroAction) {
            newMacroAction = new MoveMouseMacroAction(macroAction);
        } else if (macroAction instanceof ScrollMouseMacroAction) {
            newMacroAction = new ScrollMouseMacroAction(macroAction);
        } else if (macroAction instanceof DelayMacroAction) {
            newMacroAction = new DelayMacroAction(macroAction);
        } else if (macroAction instanceof TextMacroAction) {
            newMacroAction = new TextMacroAction(macroAction);
        }
        return newMacroAction;
    }

    private static fromJSONObject(macroAction: any): MacroAction {
       switch (macroAction.macroActionType) {
            case macroActionType.KeyMacroAction:
                return new KeyMacroAction().fromJsObject(macroAction);
            case macroActionType.MouseButtonMacroAction:
                return new MouseButtonMacroAction().fromJsObject(macroAction);
            case macroActionType.MoveMouseMacroAction:
                return new MoveMouseMacroAction().fromJsObject(macroAction);
            case macroActionType.ScrollMouseMacroAction:
                return new ScrollMouseMacroAction().fromJsObject(macroAction);
            case macroActionType.DelayMacroAction:
                return new DelayMacroAction().fromJsObject(macroAction);
            case macroActionType.TextMacroAction:
                return new TextMacroAction().fromJsObject(macroAction);
            default:
                throw `Invalid MacroAction.macroActionType: "${macroAction.macroActionType}"`;
        }
    }
}

import { UhkBuffer } from '../../uhk-buffer';
import { MacroAction, MacroActionId, macroActionType } from './macro-action';
import { KeyMacroAction } from './key-macro-action';
import { MouseButtonMacroAction } from './mouse-button-macro-action';
import { MoveMouseMacroAction } from './move-mouse-macro-action';
import { ScrollMouseMacroAction } from './scroll-mouse-macro-action';
import { DelayMacroAction } from './delay-macro-action';
import { TextMacroAction } from './text-macro-action';
import { CommandMacroAction } from './command-macro-action';

export class Helper {

    static createMacroAction(source: MacroAction | UhkBuffer | any, version: number = 4): MacroAction {
        if (source instanceof MacroAction) {
            return Helper.fromMacroAction(source);
        } else if (source instanceof UhkBuffer) {
            return Helper.fromUhkBuffer(source, version);
        } else {
            return Helper.fromJSONObject(source, version);
        }
    }

    private static fromUhkBuffer(buffer: UhkBuffer, version: number): MacroAction {
        const macroActionFirstByte = buffer.readUInt8();
        buffer.backtrack();

        if (macroActionFirstByte >= MacroActionId.KeyMacroAction && macroActionFirstByte <= MacroActionId.LastKeyMacroAction) {
            return new KeyMacroAction().fromBinary(buffer, version);
        } else if (
            macroActionFirstByte >= MacroActionId.MouseButtonMacroAction &&
            macroActionFirstByte <= MacroActionId.LastMouseButtonMacroAction
        ) {
            return new MouseButtonMacroAction().fromBinary(buffer, version);
        }
        switch (macroActionFirstByte) {
            case MacroActionId.MoveMouseMacroAction:
                return new MoveMouseMacroAction().fromBinary(buffer, version);
            case MacroActionId.ScrollMouseMacroAction:
                return new ScrollMouseMacroAction().fromBinary(buffer, version);
            case MacroActionId.DelayMacroAction:
                return new DelayMacroAction().fromBinary(buffer, version);
            case MacroActionId.TextMacroAction:
                return new TextMacroAction().fromBinary(buffer, version);
            case MacroActionId.CommandMacroAction:
                return new CommandMacroAction().fromBinary(buffer, version);
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
        } else if (macroAction instanceof CommandMacroAction) {
            newMacroAction = new CommandMacroAction(macroAction);
        }
        return newMacroAction;
    }

    private static fromJSONObject(macroAction: any, version: number): MacroAction {
        switch (macroAction.macroActionType) {
            case macroActionType.KeyMacroAction:
                return new KeyMacroAction().fromJsonObject(macroAction, version);
            case macroActionType.MouseButtonMacroAction:
                return new MouseButtonMacroAction().fromJsonObject(macroAction, version);
            case macroActionType.MoveMouseMacroAction:
                return new MoveMouseMacroAction().fromJsonObject(macroAction, version);
            case macroActionType.ScrollMouseMacroAction:
                return new ScrollMouseMacroAction().fromJsonObject(macroAction, version);
            case macroActionType.DelayMacroAction:
                return new DelayMacroAction().fromJsonObject(macroAction, version);
            case macroActionType.TextMacroAction:
                return new TextMacroAction().fromJsonObject(macroAction, version);
            case macroActionType.CommandMacroAction:
                return new CommandMacroAction().fromJsonObject(macroAction, version);
            default:
                throw `Invalid MacroAction.macroActionType: "${macroAction.macroActionType}"`;
        }
    }
}

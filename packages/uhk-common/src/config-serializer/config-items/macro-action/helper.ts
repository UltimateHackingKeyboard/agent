import { UhkBuffer } from '../../uhk-buffer.js';
import { SerialisationInfo } from '../serialisation-info.js';
import { MacroAction, MacroActionId, macroActionType } from './macro-action.js';
import { KeyMacroAction } from './key-macro-action.js';
import { MouseButtonMacroAction } from './mouse-button-macro-action.js';
import { MoveMouseMacroAction } from './move-mouse-macro-action.js';
import { ScrollMouseMacroAction } from './scroll-mouse-macro-action.js';
import { DelayMacroAction } from './delay-macro-action.js';
import { TextMacroAction } from './text-macro-action.js';
import { CommandMacroAction } from './command-macro-action.js';

export class Helper {

    static createMacroAction(source: MacroAction | UhkBuffer | any, serialisationInfo: SerialisationInfo): MacroAction {
        if (source instanceof MacroAction) {
            return Helper.fromMacroAction(source);
        } else if (source instanceof UhkBuffer) {
            return Helper.fromUhkBuffer(source, serialisationInfo);
        } else {
            return Helper.fromJSONObject(source, serialisationInfo);
        }
    }

    static fromUhkBuffer(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): MacroAction {
        const macroActionFirstByte = buffer.readUInt8();
        buffer.backtrack();

        if (macroActionFirstByte >= MacroActionId.KeyMacroAction && macroActionFirstByte <= MacroActionId.LastKeyMacroAction) {
            return new KeyMacroAction().fromBinary(buffer, serialisationInfo);
        } else if (
            macroActionFirstByte >= MacroActionId.MouseButtonMacroAction &&
            macroActionFirstByte <= MacroActionId.LastMouseButtonMacroAction
        ) {
            return new MouseButtonMacroAction().fromBinary(buffer, serialisationInfo);
        }
        switch (macroActionFirstByte) {
            case MacroActionId.MoveMouseMacroAction:
                return new MoveMouseMacroAction().fromBinary(buffer, serialisationInfo);
            case MacroActionId.ScrollMouseMacroAction:
                return new ScrollMouseMacroAction().fromBinary(buffer, serialisationInfo);
            case MacroActionId.DelayMacroAction:
                return new DelayMacroAction().fromBinary(buffer, serialisationInfo);
            case MacroActionId.TextMacroAction:
                return new TextMacroAction().fromBinary(buffer, serialisationInfo);
            case MacroActionId.CommandMacroAction:
                return new CommandMacroAction().fromBinary(buffer, serialisationInfo);
            default:
                throw `Invalid MacroAction first byte: ${macroActionFirstByte}`;
        }
    }

    static fromMacroAction(macroAction: MacroAction): MacroAction {
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

    static fromJSONObject(macroAction: any, serialisationInfo: SerialisationInfo): MacroAction {
        switch (macroAction.macroActionType) {
            case macroActionType.KeyMacroAction:
                return new KeyMacroAction().fromJsonObject(macroAction, serialisationInfo);
            case macroActionType.MouseButtonMacroAction:
                return new MouseButtonMacroAction().fromJsonObject(macroAction, serialisationInfo);
            case macroActionType.MoveMouseMacroAction:
                return new MoveMouseMacroAction().fromJsonObject(macroAction, serialisationInfo);
            case macroActionType.ScrollMouseMacroAction:
                return new ScrollMouseMacroAction().fromJsonObject(macroAction, serialisationInfo);
            case macroActionType.DelayMacroAction:
                return new DelayMacroAction().fromJsonObject(macroAction, serialisationInfo);
            case macroActionType.TextMacroAction:
                return new TextMacroAction().fromJsonObject(macroAction, serialisationInfo);
            case macroActionType.CommandMacroAction:
                return new CommandMacroAction().fromJsonObject(macroAction, serialisationInfo);
            default:
                throw `Invalid MacroAction.macroActionType: "${macroAction.macroActionType}"`;
        }
    }
}

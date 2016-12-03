import { UhkBuffer } from '../../UhkBuffer';
import {
    KeyAction,
    KeyActionId,
    KeystrokeAction,
    MouseAction,
    PlayMacroAction,
    SwitchKeymapAction,
    SwitchLayerAction,
    keyActionType
} from './index';

import { Keymap } from '../Keymap';
import { Macro } from '../Macro';

export class Helper {

    static createKeyAction(source: KeyAction | UhkBuffer | any, keymaps?: Keymap[], macros?: Macro[]): KeyAction {
        if (source instanceof KeyAction) {
            return Helper.fromKeyAction(source);
        } else if (source instanceof UhkBuffer) {
            return Helper.fromUhkBuffer(source, keymaps, macros);
        } else {
            return Helper.fromJSONObject(source, keymaps, macros);
        }
    }

    private static fromUhkBuffer(buffer: UhkBuffer, keymaps: Keymap[], macros: Macro[]): KeyAction {
        let keyActionFirstByte = buffer.readUInt8();
        buffer.backtrack();

        if (keyActionFirstByte >= KeyActionId.KeystrokeAction && keyActionFirstByte < KeyActionId.LastKeystrokeAction) {
            return new KeystrokeAction().fromBinary(buffer);
        }

        switch (keyActionFirstByte) {
            case KeyActionId.NoneAction:
                buffer.readUInt8(); // Read type just to skip it
                return undefined;
            case KeyActionId.SwitchLayerAction:
                return new SwitchLayerAction().fromBinary(buffer);
            case KeyActionId.SwitchKeymapAction:
                return new SwitchKeymapAction().fromBinary(buffer, keymaps);
            case KeyActionId.MouseAction:
                return new MouseAction().fromBinary(buffer);
            case KeyActionId.PlayMacroAction:
                return new PlayMacroAction().fromBinary(buffer, macros);
            default:
                throw `Invalid KeyAction first byte: ${keyActionFirstByte}`;
        }
    }

    private static fromKeyAction(keyAction: KeyAction): KeyAction {
        let newKeyAction: KeyAction;
        if (keyAction instanceof KeystrokeAction) {
            newKeyAction = new KeystrokeAction(keyAction);
        } else if (keyAction instanceof SwitchLayerAction) {
            newKeyAction = new SwitchLayerAction(keyAction);
        } else if (keyAction instanceof SwitchKeymapAction) {
            newKeyAction = new SwitchKeymapAction(keyAction);
        } else if (keyAction instanceof MouseAction) {
            newKeyAction = new MouseAction(keyAction);
        } else if (keyAction instanceof PlayMacroAction) {
            newKeyAction = new PlayMacroAction(keyAction);
        }
        return newKeyAction;
    }

    private static fromJSONObject(keyAction: any, keymaps: Keymap[], macros: Macro[]): KeyAction {
        if (!keyAction) {
            return;
        }

        switch (keyAction.keyActionType) {
            case keyActionType.KeystrokeAction:
                return new KeystrokeAction().fromJsonObject(keyAction);
            case keyActionType.SwitchLayerAction:
                return new SwitchLayerAction().fromJsonObject(keyAction);
            case keyActionType.SwitchKeymapAction:
                return new SwitchKeymapAction().fromJsonObject(keyAction, keymaps);
            case keyActionType.MouseAction:
                return new MouseAction().fromJsonObject(keyAction);
            case keyActionType.PlayMacroAction:
                return new PlayMacroAction().fromJsonObject(keyAction, macros);
            default:
                throw `Invalid KeyAction.keyActionType: "${keyAction.keyActionType}"`;
        }
    }
}

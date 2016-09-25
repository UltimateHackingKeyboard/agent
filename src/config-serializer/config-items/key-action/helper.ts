import { UhkBuffer } from '../../UhkBuffer';
import {
    KeyAction,
    KeyActionId,
    KeystrokeAction,
    MouseAction,
    NoneAction,
    PlayMacroAction,
    SwitchKeymapAction,
    SwitchLayerAction,
    keyActionType
} from './index';

export class Helper {

    static createKeyAction(source: KeyAction | UhkBuffer | any): KeyAction {
        if (source instanceof KeyAction) {
            return Helper.fromKeyAction(source);
        } else if (source instanceof UhkBuffer) {
            return Helper.fromUhkBuffer(source);
        } else {
            return Helper.fromJSONObject(source);
        }
    }

    private static fromUhkBuffer(buffer: UhkBuffer): KeyAction {
        let keyActionFirstByte = buffer.readUInt8();
        buffer.backtrack();

        if (keyActionFirstByte >= KeyActionId.KeystrokeAction && keyActionFirstByte < KeyActionId.LastKeystrokeAction) {
            return new KeystrokeAction().fromBinary(buffer);
        }

        switch (keyActionFirstByte) {
            case KeyActionId.NoneAction:
                return new NoneAction().fromBinary(buffer);
            case KeyActionId.SwitchLayerAction:
                return new SwitchLayerAction().fromBinary(buffer);
            case KeyActionId.SwitchKeymapAction:
                return new SwitchKeymapAction().fromBinary(buffer);
            case KeyActionId.MouseAction:
                return new MouseAction().fromBinary(buffer);
            case KeyActionId.PlayMacroAction:
                return new PlayMacroAction().fromBinary(buffer);
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
        } else {
            newKeyAction = new NoneAction();
        }
        return newKeyAction;
    }

    private static fromJSONObject(keyAction: any): KeyAction {
        switch (keyAction.keyActionType) {
            case keyActionType.NoneAction:
                return new NoneAction().fromJsObject(keyAction);
            case keyActionType.KeystrokeAction:
                return new KeystrokeAction().fromJsObject(keyAction);
            case keyActionType.SwitchLayerAction:
                return new SwitchLayerAction().fromJsObject(keyAction);
            case keyActionType.SwitchKeymapAction:
                return new SwitchKeymapAction().fromJsObject(keyAction);
            case keyActionType.MouseAction:
                return new MouseAction().fromJsObject(keyAction);
            case keyActionType.PlayMacroAction:
                return new PlayMacroAction().fromJsObject(keyAction);
            default:
                throw `Invalid KeyAction.keyActionType: "${keyAction.keyActionType}"`;
        }
    }
}

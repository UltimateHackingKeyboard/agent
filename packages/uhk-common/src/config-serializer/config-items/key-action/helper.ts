import { UhkBuffer } from '../../uhk-buffer';

import { Macro } from '../macro';
import { KeyAction, KeyActionId, keyActionType } from './key-action';
import { KeystrokeAction } from './keystroke-action';
import { SwitchLayerAction } from './switch-layer-action';
import { SwitchKeymapAction, UnresolvedSwitchKeymapAction } from './switch-keymap-action';
import { MouseAction } from './mouse-action';
import { PlayMacroAction } from './play-macro-action';
import { NoneAction } from './none-action';
import { isAllowedScancode } from '../scancode-checker';

export class Helper {

    static createKeyAction(source: KeyAction | UhkBuffer | any, macros: Macro[], version: number = 4): KeyAction {
        if (source instanceof KeyAction) {
            return Helper.fromKeyAction(source);
        } else if (source instanceof UhkBuffer) {
            return Helper.fromUhkBuffer(source, macros, version);
        } else {
            return Helper.fromJSONObject(source, macros, version);
        }
    }

    private static fromUhkBuffer(buffer: UhkBuffer, macros: Macro[], version: number): KeyAction {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                return this.fromUhkBufferV1(buffer, macros, version);

            default:
                throw new Error(`KeyAction configuration does not support version: ${version}`);
        }
    }

    private static fromUhkBufferV1(buffer: UhkBuffer, macros: Macro[], version: number): KeyAction {
        const keyActionFirstByte = buffer.readUInt8();
        buffer.backtrack();

        if (keyActionFirstByte >= KeyActionId.KeystrokeAction && keyActionFirstByte < KeyActionId.LastKeystrokeAction) {
            const keystrokeAction = new KeystrokeAction().fromBinary(buffer, version);
            if (isValidKeystrokeAction(keystrokeAction)) {
                return keystrokeAction;
            }

            return new NoneAction();
        }

        switch (keyActionFirstByte) {
            case KeyActionId.NoneAction:
                buffer.readUInt8(); // Read type just to skip it
                return undefined;
            case KeyActionId.SwitchLayerAction:
                return new SwitchLayerAction().fromBinary(buffer, version);
            case KeyActionId.SwitchKeymapAction:
                return new UnresolvedSwitchKeymapAction().fromBinary(buffer, version);
            case KeyActionId.MouseAction:
                return new MouseAction().fromBinary(buffer, version);
            case KeyActionId.PlayMacroAction:
                return new PlayMacroAction().fromBinary(buffer, macros, version);
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

    private static fromJSONObject(keyAction: any, macros: Macro[], version: number): KeyAction {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                return this.fromJSONObjectV1(keyAction, macros, version);

            default:
                throw new Error(`KeyAction configuration does not support version: ${version}`);
        }
    }

    private static fromJSONObjectV1(keyAction: any, macros: Macro[], version: number): KeyAction {
        if (!keyAction) {
            return null;
        }

        switch (keyAction.keyActionType) {
            case keyActionType.KeystrokeAction: {
                const keystrokeAction = new KeystrokeAction().fromJsonObject(keyAction, version);
                if (isValidKeystrokeAction(keystrokeAction)) {
                    return keystrokeAction;
                }

                return new NoneAction();
            }
            case keyActionType.SwitchLayerAction:
                return new SwitchLayerAction().fromJsonObject(keyAction, version);
            case keyActionType.SwitchKeymapAction:
                return new SwitchKeymapAction().fromJsonObject(keyAction, version);
            case keyActionType.MouseAction:
                return new MouseAction().fromJsonObject(keyAction, version);
            case keyActionType.PlayMacroAction:
                return new PlayMacroAction().fromJsonObject(keyAction, macros, version);
            case keyActionType.NoneAction:
                return new NoneAction();
            default:
                throw `Invalid KeyAction.keyActionType: "${keyAction.keyActionType}"`;
        }
    }
}

function isValidKeystrokeAction(keystrokeAction: KeystrokeAction): boolean {
    return keystrokeAction.hasSecondaryRoleAction() ||
        keystrokeAction.hasActiveModifier() ||
        keystrokeAction.hasScancode() && isAllowedScancode(keystrokeAction);
}

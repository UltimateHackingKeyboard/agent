import { UhkBuffer } from '../../uhk-buffer.js';

import { Macro } from '../macro.js';
import { SerialisationInfo } from '../serialisation-info.js';
import { KeyAction, KeyActionId, keyActionType } from './key-action.js';
import { KeystrokeAction } from './keystroke-action.js';
import { SwitchLayerAction } from './switch-layer-action.js';
import { SwitchKeymapAction, UnresolvedSwitchKeymapAction } from './switch-keymap-action.js';
import { MouseAction } from './mouse-action.js';
import { PlayMacroAction } from './play-macro-action.js';
import { NoneAction } from './none-action.js';
import { isAllowedScancode } from '../scancode-checker.js';

export class Helper {

    static createKeyAction(source: KeyAction | UhkBuffer | any, macros: Macro[], serialisationInfo: SerialisationInfo): KeyAction {
        if (source instanceof KeyAction) {
            return Helper.fromKeyAction(source);
        } else if (source instanceof UhkBuffer) {
            return Helper.fromUhkBuffer(source, macros, serialisationInfo);
        } else {
            return Helper.fromJSONObject(source, macros, serialisationInfo);
        }
    }

    private static fromUhkBuffer(buffer: UhkBuffer, macros: Macro[], serialisationInfo: SerialisationInfo): KeyAction {
        switch (serialisationInfo.userConfigMajorVersion) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                return this.fromUhkBufferV1(buffer, macros, serialisationInfo);

            default:
                throw new Error(`KeyAction configuration does not support version: ${serialisationInfo.userConfigMajorVersion}`);
        }
    }

    private static fromUhkBufferV1(buffer: UhkBuffer, macros: Macro[], serialisationInfo: SerialisationInfo): KeyAction {
        const keyActionFirstByte = buffer.readUInt8();
        buffer.backtrack();

        if (keyActionFirstByte >= KeyActionId.KeystrokeAction && keyActionFirstByte < KeyActionId.LastKeystrokeAction) {
            const keystrokeAction = new KeystrokeAction().fromBinary(buffer, serialisationInfo);
            if (isValidKeystrokeAction(keystrokeAction)) {
                return keystrokeAction;
            }

            return new NoneAction();
        }

        switch (keyActionFirstByte) {
            case KeyActionId.NoneAction:
                return new NoneAction().fromBinary(buffer, serialisationInfo);
            case KeyActionId.SwitchLayerAction:
                return new SwitchLayerAction().fromBinary(buffer, serialisationInfo);
            case KeyActionId.SwitchKeymapAction:
                return new UnresolvedSwitchKeymapAction().fromBinary(buffer, serialisationInfo);
            case KeyActionId.MouseAction:
                return new MouseAction().fromBinary(buffer, serialisationInfo);
            case KeyActionId.PlayMacroAction:
                return new PlayMacroAction().fromBinary(buffer, serialisationInfo, macros);
            default:
                throw `Invalid KeyAction first byte: ${keyActionFirstByte}`;
        }
    }

    static fromKeyAction(keyAction: KeyAction): KeyAction {
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
        } else if (keyAction instanceof NoneAction) {
            newKeyAction = new NoneAction(keyAction);
        }

        return newKeyAction;
    }

    static fromJSONObject(keyAction: any, macros: Macro[], serialisationInfo: SerialisationInfo): KeyAction {
        switch (serialisationInfo.userConfigMajorVersion) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                return this.fromJSONObjectV1(keyAction, macros, serialisationInfo);

            default:
                throw new Error(`KeyAction configuration does not support version: ${serialisationInfo.userConfigMajorVersion}`);
        }
    }

    private static fromJSONObjectV1(keyAction: any, macros: Macro[], serialisationInfo: SerialisationInfo): KeyAction {
        if (!keyAction) {
            return new NoneAction();
        }

        switch (keyAction.keyActionType) {
            case keyActionType.KeystrokeAction: {
                const keystrokeAction = new KeystrokeAction().fromJsonObject(keyAction, serialisationInfo);
                if (isValidKeystrokeAction(keystrokeAction)) {
                    return keystrokeAction;
                }

                return new NoneAction();
            }
            case keyActionType.SwitchLayerAction:
                return new SwitchLayerAction().fromJsonObject(keyAction, serialisationInfo);
            case keyActionType.SwitchKeymapAction:
                return new SwitchKeymapAction().fromJsonObject(keyAction, serialisationInfo);
            case keyActionType.MouseAction:
                return new MouseAction().fromJsonObject(keyAction, serialisationInfo);
            case keyActionType.PlayMacroAction:
                return new PlayMacroAction().fromJsonObject(keyAction, serialisationInfo, macros);
            case keyActionType.NoneAction:
                return new NoneAction().fromJsonObject(keyAction, serialisationInfo);
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

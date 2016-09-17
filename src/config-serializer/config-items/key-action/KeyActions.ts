import { ClassArray } from '../../ClassArray';
import { UhkBuffer } from '../../UhkBuffer';
import { KeyAction, KeyActionId, keyActionType } from './KeyAction';
import { KeystrokeAction } from './KeystrokeAction';
import { MouseAction } from './MouseAction';
import { NoneAction } from './NoneAction';
import { PlayMacroAction } from './PlayMacroAction';
import { SwitchKeymapAction } from './SwitchKeymapAction';
import { SwitchLayerAction } from './SwitchLayerAction';

export class KeyActions extends ClassArray<KeyAction> {

    constructor(other?: KeyActions) {
        super();
        if (!other) {
            return;
        }
        other.elements.forEach(keyAction => {
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
            this.elements.push(newKeyAction);
        });
    }

    jsObjectToClass(jsObject: any): KeyAction {
        switch (jsObject.keyActionType) {
            case keyActionType.NoneAction:
                return new NoneAction().fromJsObject(jsObject);
            case keyActionType.KeystrokeAction:
                return new KeystrokeAction().fromJsObject(jsObject);
            case keyActionType.SwitchLayerAction:
                return new SwitchLayerAction().fromJsObject(jsObject);
            case keyActionType.SwitchKeymapAction:
                return new SwitchKeymapAction().fromJsObject(jsObject);
            case keyActionType.MouseAction:
                return new MouseAction().fromJsObject(jsObject);
            case keyActionType.PlayMacroAction:
                return new PlayMacroAction().fromJsObject(jsObject);
            default:
                throw `Invalid KeyAction.keyActionType: "${jsObject.keyActionType}"`;
        }
    }

    binaryToClass(buffer: UhkBuffer): KeyAction {
        let keyActionFirstByte = buffer.readUInt8();
        buffer.backtrack();

        if (buffer.enableDump) {
            process.stdout.write(']\n');
            buffer.enableDump = false;
        }

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
}

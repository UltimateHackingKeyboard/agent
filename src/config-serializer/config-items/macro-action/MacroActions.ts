import {ClassArray} from '../../ClassArray';
import {UhkBuffer} from '../../UhkBuffer';
import {DelayMacroAction} from './DelayMacroAction';
import {MacroAction, macroActionType, MacroActionId} from './MacroAction';
import {KeyMacroAction} from './KeyMacroAction';
import {MouseButtonMacroAction} from './MouseButtonMacroAction';
import {MoveMouseMacroAction} from './MoveMouseMacroAction';
import {ScrollMouseMacroAction} from './ScrollMouseMacroAction';
import {TextMacroAction} from './TextMacroAction';

export class MacroActions extends ClassArray<MacroAction> {

    jsObjectToClass(jsObject: any): MacroAction {
        switch (jsObject.macroActionType) {
            case macroActionType.PressKeyMacroAction:
            case macroActionType.HoldKeyMacroAction:
            case macroActionType.ReleaseKeyMacroAction:
            case macroActionType.PressModifiersMacroAction:
            case macroActionType.HoldModifiersMacroAction:
            case macroActionType.ReleaseModifiersMacroAction:
                return new KeyMacroAction().fromJsObject(jsObject);
            case macroActionType.PressMouseButtonsMacroAction:
            case macroActionType.HoldMouseButtonsMacroAction:
            case macroActionType.ReleaseMouseButtonsMacroAction:
                return new MouseButtonMacroAction().fromJsObject(jsObject);
            case macroActionType.MoveMouseMacroAction:
                return new MoveMouseMacroAction().fromJsObject(jsObject);
            case macroActionType.ScrollMouseMacroAction:
                return new ScrollMouseMacroAction().fromJsObject(jsObject);
            case macroActionType.DelayMacroAction:
                return new DelayMacroAction().fromJsObject(jsObject);
            case macroActionType.TextMacroAction:
                return new TextMacroAction().fromJsObject(jsObject);
            default:
                throw `Invalid MacroAction.macroActionType: "${jsObject.macroActionType}"`;
        }
    }

    binaryToClass(buffer: UhkBuffer): MacroAction {
        let macroActionFirstByte = buffer.readUInt8();
        buffer.backtrack();

        if (buffer.enableDump) {
            process.stdout.write(']\n');
            buffer.enableDump = false;
        }

        switch (macroActionFirstByte) {
            case MacroActionId.PressKeyMacroAction:
            case MacroActionId.HoldKeyMacroAction:
            case MacroActionId.ReleaseKeyMacroAction:
            case MacroActionId.PressModifiersMacroAction:
            case MacroActionId.HoldModifiersMacroAction:
            case MacroActionId.ReleaseModifiersMacroAction:
                return new KeyMacroAction().fromBinary(buffer);
            case MacroActionId.PressMouseButtonsMacroAction:
            case MacroActionId.HoldMouseButtonsMacroAction:
            case MacroActionId.ReleaseMouseButtonsMacroAction:
                return new MouseButtonMacroAction().fromBinary(buffer);
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
}

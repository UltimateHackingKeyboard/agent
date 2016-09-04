import {ClassArray} from '../../ClassArray';
import {UhkBuffer} from '../../UhkBuffer';
import {DelayMacroAction} from './DelayMacroAction';
import {HoldKeyMacroAction} from './HoldKeyMacroAction';
import {HoldModifiersMacroAction} from './HoldModifiersMacroAction';
import {HoldMouseButtonsMacroAction} from './HoldMouseButtonsMacroAction';
import {MacroAction, MacroActionId, macroActionType} from './MacroAction';
import {MoveMouseMacroAction} from './MoveMouseMacroAction';
import {PressKeyMacroAction} from './PressKeyMacroAction';
import {PressModifiersMacroAction} from './PressModifiersMacroAction';
import {PressMouseButtonsMacroAction} from './PressMouseButtonsMacroAction';
import {ReleaseKeyMacroAction} from './ReleaseKeyMacroAction';
import {ReleaseModifiersMacroAction} from './ReleaseModifiersMacroAction';
import {ReleaseMouseButtonsMacroAction} from './ReleaseMouseButtonsMacroAction';
import {ScrollMouseMacroAction} from './ScrollMouseMacroAction';
import {TextMacroAction} from './TextMacroAction';

export class MacroActions extends ClassArray<MacroAction> {

    jsObjectToClass(jsObject: any): MacroAction {
        switch (jsObject.macroActionType) {
            case macroActionType.PressKeyMacroAction:
                return new PressKeyMacroAction().fromJsObject(jsObject);
            case macroActionType.HoldKeyMacroAction:
                return new HoldKeyMacroAction().fromJsObject(jsObject);
            case macroActionType.ReleaseKeyMacroAction:
                return new ReleaseKeyMacroAction().fromJsObject(jsObject);
            case macroActionType.PressModifiersMacroAction:
                return new PressModifiersMacroAction().fromJsObject(jsObject);
            case macroActionType.HoldModifiersMacroAction:
                return new HoldModifiersMacroAction().fromJsObject(jsObject);
            case macroActionType.ReleaseModifiersMacroAction:
                return new ReleaseModifiersMacroAction().fromJsObject(jsObject);
            case macroActionType.PressMouseButtonsMacroAction:
                return new PressMouseButtonsMacroAction().fromJsObject(jsObject);
            case macroActionType.HoldMouseButtonsMacroAction:
                return new HoldMouseButtonsMacroAction().fromJsObject(jsObject);
            case macroActionType.ReleaseMouseButtonsMacroAction:
                return new ReleaseMouseButtonsMacroAction().fromJsObject(jsObject);
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
                return new PressKeyMacroAction().fromBinary(buffer);
            case MacroActionId.HoldKeyMacroAction:
                return new HoldKeyMacroAction().fromBinary(buffer);
            case MacroActionId.ReleaseKeyMacroAction:
                return new ReleaseKeyMacroAction().fromBinary(buffer);
            case MacroActionId.PressModifiersMacroAction:
                return new PressModifiersMacroAction().fromBinary(buffer);
            case MacroActionId.HoldModifiersMacroAction:
                return new HoldModifiersMacroAction().fromBinary(buffer);
            case MacroActionId.ReleaseModifiersMacroAction:
                return new ReleaseModifiersMacroAction().fromBinary(buffer);
            case MacroActionId.PressMouseButtonsMacroAction:
                return new PressMouseButtonsMacroAction().fromBinary(buffer);
            case MacroActionId.HoldMouseButtonsMacroAction:
                return new HoldMouseButtonsMacroAction().fromBinary(buffer);
            case MacroActionId.ReleaseMouseButtonsMacroAction:
                return new ReleaseMouseButtonsMacroAction().fromBinary(buffer);
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

import { assertEnum, assertUInt8, assertUInt16 } from '../../assert';
import { UhkBuffer } from '../../uhk-buffer';
import { KeyModifiers } from '../key-modifiers';
import { MacroAction, MacroActionId, MacroKeySubAction, macroActionType } from './macro-action';
import { KeystrokeType } from '../key-action';

export interface JsObjectKeyMacroAction {
    macroActionType: string;
    action: string;
    type?: string;
    scancode?: number;
    modifierMask?: number;
}

export class KeyMacroAction extends MacroAction {
    @assertEnum(MacroKeySubAction)
    action: MacroKeySubAction;

    @assertEnum(KeystrokeType)
    type: KeystrokeType;

    @assertUInt8
    modifierMask: number;

    @assertUInt16
    private _scancode: number;

    set scancode(scancode: number) {
        this._scancode = scancode;
        if (this.type !== KeystrokeType.shortMedia && this.type !== KeystrokeType.longMedia) {
            return;
        }
        this.type = scancode < 256 ? KeystrokeType.shortMedia : KeystrokeType.longMedia;
    }

    get scancode() {
        return this._scancode;
    }

    constructor(other?: KeyMacroAction) {
        super();
        if (!other) {
            return;
        }
        this.action = other.action;
        this.type = other.type;
        this._scancode = other._scancode;
        this.modifierMask = other.modifierMask;
    }

    fromJsonObject(jsObject: JsObjectKeyMacroAction): KeyMacroAction {
        this.assertMacroActionType(jsObject);
        this.action = MacroKeySubAction[jsObject.action];
        if (jsObject.type === 'media') {
            this.type = jsObject.scancode < 256 ? KeystrokeType.shortMedia : KeystrokeType.longMedia;
        } else {
            this.type = KeystrokeType[jsObject.type];
        }
        this._scancode = jsObject.scancode;
        this.modifierMask = jsObject.modifierMask;
        return this;
    }

    fromBinary(buffer: UhkBuffer): KeyMacroAction {
        const macroActionId: MacroActionId = this.readAndAssertMacroActionId(buffer);
        let keyMacroType: number = macroActionId - MacroActionId.KeyMacroAction;
        this.action = keyMacroType & 0b11;
        keyMacroType >>= 2;
        this.type = keyMacroType & 0b11;
        keyMacroType >>= 2;
        if (keyMacroType & 0b10) {
            this._scancode = this.type === KeystrokeType.longMedia ? buffer.readUInt16() : buffer.readUInt8();
        }
        if (keyMacroType & 0b01) {
            this.modifierMask = buffer.readUInt8();
        }
        return this;
    }

    toJsonObject(): any {
        const jsObject: JsObjectKeyMacroAction = {
            macroActionType: macroActionType.KeyMacroAction,
            action: MacroKeySubAction[this.action]
        };

        if (this.hasScancode()) {
            if (this.type === KeystrokeType.shortMedia || this.type === KeystrokeType.longMedia) {
                jsObject.type = 'media';
            } else {
                jsObject.type = KeystrokeType[this.type];
            }
            jsObject.scancode = this._scancode;
        }

        if (this.hasModifiers()) {
            jsObject.modifierMask = this.modifierMask;
        }

        return jsObject;
    }

    toBinary(buffer: UhkBuffer) {
        let TYPE_OFFSET = 0;
        TYPE_OFFSET |= this.action;
        TYPE_OFFSET |= this.type << 2;
        TYPE_OFFSET |= ((this.hasScancode() ? 2 : 0) + (this.hasModifiers() ? 1 : 0)) << 4;

        const keyMacroType: number = MacroActionId.KeyMacroAction + TYPE_OFFSET;

        buffer.writeUInt8(keyMacroType);
        if (this.hasScancode()) {
            if (this.type === KeystrokeType.longMedia) {
                buffer.writeUInt16(this.scancode);
            } else {
                buffer.writeUInt8(this.scancode);
            }
        }
        if (this.hasModifiers()) {
            buffer.writeUInt8(this.modifierMask);
        }
    }

    toString(): string {
        return `<KeyMacroAction action="${this.action}" scancode="${this._scancode}" modifierMask="${this.modifierMask}">`;
    }

    isModifierActive(modifier: KeyModifiers): boolean {
        return (this.modifierMask & modifier) > 0;
    }

    hasScancode(): boolean {
        return !!this._scancode;
    }

    hasModifiers(): boolean {
        return !!this.modifierMask;
    }

    isPressAction(): boolean {
        return this.action === MacroKeySubAction.press;
    }

    isTapAction(): boolean {
        return this.action === MacroKeySubAction.tap;
    }

    isReleaseAction(): boolean {
        return this.action === MacroKeySubAction.release;
    }

    public getName(): string {
        return 'KeyMacroAction';
    }
}

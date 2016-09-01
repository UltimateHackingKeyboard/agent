import {assertEnum, assertUInt8} from '../assert';
import {UhkBuffer} from '../UhkBuffer';
import {KeyAction, KeyActionId, keyActionType} from './KeyAction';
import {KeyModifiers} from './KeyModifiers';
import {LongPressAction} from './LongPressAction';

export enum KeystrokeActionFlag {
    scancode = 1 << 0,
    modifierMask = 1 << 1,
    longPressAction = 1 << 2,
}

interface JsObjectKeystrokeAction {
    keyActionType: string;
    scancode?: number;
    modifierMask?: number;
    longPressAction?: string;
}

export class KeystrokeAction extends KeyAction {

    @assertUInt8
    scancode: number;

    @assertUInt8
    modifierMask: number;

    @assertEnum(LongPressAction)
    longPressAction: LongPressAction;

    _fromJsObject(jsObject: JsObjectKeystrokeAction): KeystrokeAction {
        this.assertKeyActionType(jsObject);
        this.scancode = jsObject.scancode;
        this.modifierMask = jsObject.modifierMask;
        this.longPressAction = LongPressAction[jsObject.longPressAction];
        return this;
    }

    _fromBinary(buffer: UhkBuffer): KeystrokeAction {
        let keyActionId: KeyActionId = this.readAndAssertKeyActionId(buffer);
        let flags: number = keyActionId - KeyActionId.KeystrokeAction;
        if (flags & KeystrokeActionFlag.scancode) {
            this.scancode = buffer.readUInt8();
        }
        if (flags & KeystrokeActionFlag.modifierMask) {
            this.modifierMask = buffer.readUInt8();
        }
        if (flags & KeystrokeActionFlag.longPressAction) {
            this.longPressAction = buffer.readUInt8();
        }
        return this;
    }

    _toJsObject(): JsObjectKeystrokeAction {
        let jsObject: JsObjectKeystrokeAction = {
            keyActionType: keyActionType.KeystrokeAction
        };

        if (this.hasScancode()) {
            jsObject.scancode = this.scancode;
        }

        if (this.hasActiveModifier()) {
            jsObject.modifierMask = this.modifierMask;
        }

        if (this.hasLongPressAction()) {
            jsObject.longPressAction = LongPressAction[this.longPressAction];
        }

        return jsObject;
    }

    _toBinary(buffer: UhkBuffer) {
        let flags = 0;
        let bufferData: number[] = [];

        if (this.hasScancode()) {
            flags |= KeystrokeActionFlag.scancode;
            bufferData.push(this.scancode);
        }

        if (this.hasActiveModifier()) {
            flags |= KeystrokeActionFlag.modifierMask;
            bufferData.push(this.modifierMask);
        }

        if (this.hasLongPressAction()) {
            flags |= KeystrokeActionFlag.longPressAction;
            bufferData.push(this.longPressAction);
        }

        buffer.writeUInt8(KeyActionId.KeystrokeAction + flags);
        for (let i = 0; i < bufferData.length; ++i) {
            buffer.writeUInt8(bufferData[i]);
        }
    }

    toString(): string {
        let properties: string[] = [];
        if (this.hasScancode()) {
            properties.push(`scancode="${this.scancode}"`);
        }
        if (this.hasActiveModifier()) {
            properties.push(`modifierMask="${this.modifierMask}"`);
        }
        if (this.hasLongPressAction()) {
            properties.push(`longPressAction="${this.longPressAction}"`);
        }

        return `<KeystrokeAction ${properties.join(' ')}>`;
    }

    isActive(modifier: KeyModifiers): boolean {
        return (this.modifierMask & modifier) > 0;
    }

    hasActiveModifier(): boolean {
        return this.modifierMask > 0;
    }

    hasLongPressAction(): boolean {
        return this.longPressAction !== undefined;
    }

    hasScancode(): boolean {
        return !!this.scancode;
    }

    hasOnlyOneActiveModifier(): boolean {
        return this.modifierMask !== 0 && !(this.modifierMask & this.modifierMask - 1);
    }
}

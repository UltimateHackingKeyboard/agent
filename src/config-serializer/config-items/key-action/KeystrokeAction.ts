import { assertEnum, assertUInt8 } from '../../assert';
import { UhkBuffer } from '../../UhkBuffer';
import { KeyModifiers } from '../KeyModifiers';
import { LongPressAction } from '../LongPressAction';
import { KeyAction, KeyActionId, keyActionType } from './KeyAction';

export enum KeystrokeActionFlag {
    scancode = 1 << 0,
    modifierMask = 1 << 1,
    longPressAction = 1 << 2
}

interface JsonObjectKeystrokeAction {
    keyActionType: string;
    scancode?: number;
    modifierMask?: number;
    longPressAction?: string;
}

const MODIFIERS = ['LCtrl', 'LShift', 'LAlt',  'LSuper', 'RCtrl', 'RShift', 'RAlt', 'RSuper'];

export class KeystrokeAction extends KeyAction {

    @assertUInt8
    scancode: number;

    @assertUInt8
    modifierMask: number;

    @assertEnum(LongPressAction)
    longPressAction: LongPressAction;

    constructor(other?: KeystrokeAction) {
        super();
        if (!other) {
            return;
        }
        this.scancode = other.scancode;
        this.modifierMask = other.modifierMask;
        this.longPressAction = other.longPressAction;
    }

    fromJsonObject(jsonObject: JsonObjectKeystrokeAction): KeystrokeAction {
        this.assertKeyActionType(jsonObject);
        this.scancode = jsonObject.scancode;
        this.modifierMask = jsonObject.modifierMask;
        this.longPressAction = LongPressAction[jsonObject.longPressAction];
        return this;
    }

    fromBinary(buffer: UhkBuffer): KeystrokeAction {
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

    _toJsonObject(): JsonObjectKeystrokeAction {
        let jsonObject: JsonObjectKeystrokeAction = {
            keyActionType: keyActionType.KeystrokeAction
        };

        if (this.hasScancode()) {
            jsonObject.scancode = this.scancode;
        }

        if (this.hasActiveModifier()) {
            jsonObject.modifierMask = this.modifierMask;
        }

        if (this.hasLongPressAction()) {
            jsonObject.longPressAction = LongPressAction[this.longPressAction];
        }

        return jsonObject;
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

    getModifierList(): string[] {
        let modifierList: string[] = [];
        let modifierMask = this.modifierMask;
        for (let i = 0; modifierMask !== 0; ++i, modifierMask >>= 1) {
            if (modifierMask & 1) {
                modifierList.push(MODIFIERS[i]);
            }
        }
        return modifierList;
    }
}

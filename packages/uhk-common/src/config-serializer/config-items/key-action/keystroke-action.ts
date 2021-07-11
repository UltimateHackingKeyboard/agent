import { assertEnum, assertUInt8 } from '../../assert';
import { UhkBuffer } from '../../uhk-buffer';
import { KeyModifiers } from '../key-modifiers';
import { SecondaryRoleAction } from '../secondary-role-action';
import { KeyAction, KeyActionId, keyActionType } from './key-action';
import { KeystrokeType } from './keystroke-type';

export enum KeystrokeActionFlag {
    scancode = 1 << 0,
    modifierMask = 1 << 1,
    secondaryRoleAction = 1 << 2
}

const KEYSTROKE_ACTION_FLAG_LENGTH = 3;

export interface JsonObjectKeystrokeAction {
    keyActionType: string;
    scancode?: number;
    modifierMask?: number;
    secondaryRoleAction?: string;
    type?: string;
}

const MODIFIERS = ['LCtrl', 'LShift', 'LAlt', 'LSuper', 'RCtrl', 'RShift', 'RAlt', 'RSuper'];

export class KeystrokeAction extends KeyAction {

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

    @assertUInt8
    modifierMask: number;

    @assertEnum(SecondaryRoleAction)
    secondaryRoleAction: SecondaryRoleAction;

    set type(type: KeystrokeType) {
        if (type === KeystrokeType.shortMedia || type === KeystrokeType.longMedia) {
            type = this.scancode < 256 ? KeystrokeType.shortMedia : KeystrokeType.longMedia;
        }
        this._type = type;
    }

    get type() {
        return this._type;
    }

    private _scancode: number;

    @assertEnum(KeystrokeType)
    private _type: KeystrokeType;

    constructor(other?: KeystrokeAction) {
        super();
        if (!other) {
            return;
        }
        this.type = other.type;
        this._scancode = other._scancode;
        this.modifierMask = other.modifierMask;
        this.secondaryRoleAction = other.secondaryRoleAction;
    }

    fromJsonObject(jsonObject: JsonObjectKeystrokeAction, version: number): KeystrokeAction {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                this.fromJsonObjectV1(jsonObject);
                break;

            default:
                throw new Error(`Keystroke action does not support version: ${version}`);
        }

        return this;
    }

    fromBinary(buffer: UhkBuffer, version: number): KeystrokeAction {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                this.fromBinaryV1(buffer);
                break;

            default:
                throw new Error(`Keystroke action does not support version: ${version}`);
        }

        return this;
    }

    toJsonObject(): JsonObjectKeystrokeAction {
        const jsonObject: JsonObjectKeystrokeAction = {
            keyActionType: keyActionType.KeystrokeAction
        };

        if (this.type === KeystrokeType.shortMedia || this.type === KeystrokeType.longMedia) {
            jsonObject.type = 'media';
        } else {
            jsonObject.type = KeystrokeType[this.type];
        }

        if (this.hasScancode()) {
            jsonObject.scancode = this._scancode;
        }

        if (this.hasActiveModifier()) {
            jsonObject.modifierMask = this.modifierMask;
        }

        if (this.hasSecondaryRoleAction()) {
            jsonObject.secondaryRoleAction = SecondaryRoleAction[this.secondaryRoleAction];
        }

        return jsonObject;
    }

    toBinary(buffer: UhkBuffer) {
        let flags = 0;
        const toWrite: {
            data: number,
            long: boolean
        }[] = [];

        if (this.hasScancode()) {
            flags |= KeystrokeActionFlag.scancode;
            toWrite.push({data: this._scancode, long: this.type === KeystrokeType.longMedia});
        }

        if (this.hasActiveModifier()) {
            flags |= KeystrokeActionFlag.modifierMask;
            toWrite.push({data: this.modifierMask, long: false});
        }

        if (this.hasSecondaryRoleAction()) {
            flags |= KeystrokeActionFlag.secondaryRoleAction;
            toWrite.push({data: this.secondaryRoleAction, long: false});
        }

        const TYPE_OFFSET = flags + (this.type << KEYSTROKE_ACTION_FLAG_LENGTH);

        buffer.writeUInt8(KeyActionId.NoneAction + TYPE_OFFSET); // NoneAction is the same as an empty KeystrokeAction.

        for (let i = 0; i < toWrite.length; ++i) {
            if (toWrite[i].long) {
                buffer.writeUInt16(toWrite[i].data);
            } else {
                buffer.writeUInt8(toWrite[i].data);
            }
        }

    }

    toString(): string {
        const properties: string[] = [];
        properties.push(`type="${KeystrokeType[this.type]}"`);

        if (this.hasScancode()) {
            properties.push(`scancode="${this._scancode}"`);
        }
        if (this.hasActiveModifier()) {
            properties.push(`modifierMask="${this.modifierMask}"`);
        }
        if (this.hasSecondaryRoleAction()) {
            properties.push(`secondaryRoleAction="${this.secondaryRoleAction}"`);
        }

        return `<KeystrokeAction ${properties.join(' ')}>`;
    }

    isActive(modifier: KeyModifiers): boolean {
        return (this.modifierMask & modifier) > 0;
    }

    hasActiveModifier(): boolean {
        return this.modifierMask > 0;
    }

    hasSecondaryRoleAction(): boolean {
        return this.secondaryRoleAction !== undefined && this.secondaryRoleAction !== null;
    }

    hasScancode(): boolean {
        return !!this._scancode;
    }

    hasOnlyOneActiveModifier(): boolean {
        return this.modifierMask !== 0 && !(this.modifierMask & this.modifierMask - 1);
    }

    getModifierList(): string[] {
        const modifierList: string[] = [];
        let modifierMask = this.modifierMask;
        for (let i = 0; modifierMask !== 0; ++i, modifierMask >>= 1) {
            if (modifierMask & 1) {
                modifierList.push(MODIFIERS[i]);
            }
        }
        return modifierList;
    }

    public getName(): string {
        return 'KeystrokeAction';
    }

    private fromJsonObjectV1(jsonObject: JsonObjectKeystrokeAction): void {
        this.assertKeyActionType(jsonObject);
        if (jsonObject.type === 'media') {
            this.type = jsonObject.scancode < 256 ? KeystrokeType.shortMedia : KeystrokeType.longMedia;
        } else {
            this.type = KeystrokeType[jsonObject.type];
        }

        this._scancode = jsonObject.scancode;
        this.modifierMask = jsonObject.modifierMask;
        this.secondaryRoleAction = SecondaryRoleAction[jsonObject.secondaryRoleAction];
    }

    private fromBinaryV1(buffer: UhkBuffer): void {
        const keyActionId: KeyActionId = this.readAndAssertKeyActionId(buffer);
        const flags: number = keyActionId - KeyActionId.NoneAction; // NoneAction is the same as an empty KeystrokeAction.
        this.type = (flags >> 3) & 0b11;
        if (flags & KeystrokeActionFlag.scancode) {
            this._scancode = this.type === KeystrokeType.longMedia ? buffer.readUInt16() : buffer.readUInt8();
        }
        if (flags & KeystrokeActionFlag.modifierMask) {
            this.modifierMask = buffer.readUInt8();
        }
        if (flags & KeystrokeActionFlag.secondaryRoleAction) {
            this.secondaryRoleAction = buffer.readUInt8();
        }
    }
}

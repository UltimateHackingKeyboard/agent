import { copyRgbColor } from '../../../util/index.js';
import { assertUInt8 } from '../../assert.js';
import { UhkBuffer } from '../../uhk-buffer.js';
import { Keymap } from '../keymap.js';
import { SerialisationInfo } from '../serialisation-info.js';
import { KeyAction, KeyActionId, keyActionType } from './key-action.js';
import { UserConfiguration } from '../user-configuration.js';

export class SwitchKeymapAction extends KeyAction {

    keymapAbbreviation: string;

    constructor(parameter?: SwitchKeymapAction | Keymap | string) {
        if (!parameter) {
            super();
            return;
        }
        if (parameter instanceof SwitchKeymapAction) {
            super(parameter);
            this.keymapAbbreviation = parameter.keymapAbbreviation;
        } else if (parameter instanceof Keymap) {
            super();
            this.keymapAbbreviation = parameter.abbreviation;
        } else {
            super();
            this.keymapAbbreviation = parameter;
        }
    }

    fromJsonObject(jsonObject: any, serialisationInfo: SerialisationInfo): SwitchKeymapAction {
        switch (serialisationInfo.userConfigMajorVersion) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                this.fromJsonObjectV1(jsonObject);
                break;

            case 6:
            case 7:
                this.fromJsonObjectV6(jsonObject, serialisationInfo);
                break;

            default:
                throw new Error(`Switch keymap action does not support version: ${serialisationInfo.userConfigMajorVersion}`);
        }

        return this;
    }

    toJsonObject(serialisationInfo: SerialisationInfo): any {
        return {
            keyActionType: keyActionType.SwitchKeymapAction,
            keymapAbbreviation: this.keymapAbbreviation,
            ...this.rgbColorToJson(serialisationInfo)
        };
    }

    toBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo, userConfiguration: UserConfiguration): void {
        const keymapIndex = userConfiguration.keymaps.findIndex(keymap => keymap.abbreviation === this.keymapAbbreviation);
        buffer.writeUInt8(KeyActionId.SwitchKeymapAction);
        buffer.writeUInt8(keymapIndex);
        this.rgbColorToBinary(buffer, serialisationInfo);
    }

    toString(): string {
        return `<SwitchKeymapAction keymapAbbreviation="${this.keymapAbbreviation}">`;
    }

    renameKeymap(oldAbbr: string, newAbbr: string): KeyAction {
        if (this.keymapAbbreviation !== oldAbbr) {
            return this;
        }
        return new SwitchKeymapAction(newAbbr);
    }

    public getName(): string {
        return 'SwitchKeymapAction';
    }

    private fromJsonObjectV1(jsonObject: any): void {
        this.assertKeyActionType(jsonObject);
        this.keymapAbbreviation = jsonObject.keymapAbbreviation;
    }

    private fromJsonObjectV6(jsonObject: any, serialisationInfo: SerialisationInfo): void {
        this.fromJsonObjectV1(jsonObject);
        this.rgbColorFromJson(jsonObject, serialisationInfo);
    }
}

export class UnresolvedSwitchKeymapAction extends KeyAction {

    @assertUInt8 keymapIndex: number;

    constructor(keymapIndex?: number) {
        super();
        this.keymapIndex = keymapIndex;
    }

    fromBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): UnresolvedSwitchKeymapAction {
        switch (serialisationInfo.userConfigMajorVersion) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                this.fromBinaryV1(buffer);
                break;

            case 6:
            case 7:
                this.fromBinaryV6(buffer, serialisationInfo);
                break;

            default:
                throw new Error(`Unresolved switch keymap action does not support version: ${serialisationInfo.userConfigMajorVersion}`);
        }

        return this;
    }

    toBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo) {
        buffer.writeUInt8(KeyActionId.SwitchKeymapAction);
        buffer.writeUInt8(this.keymapIndex);
        this.rgbColorToBinary(buffer, serialisationInfo);
    }

    toJsonObject(): any {
        throw new Error('UnresolvedSwitchKeymapAction cannot be serialized directly. Convert it to SwitchKeymapAction first.');
    }

    resolve(keymaps: Keymap[]): SwitchKeymapAction {
        const action = new SwitchKeymapAction(keymaps[this.keymapIndex]);
        copyRgbColor(this, action);

        return action;
    }

    public getName(): string {
        return 'UnresolvedSwitchKeymapAction';
    }

    private fromBinaryV1(buffer: UhkBuffer): void {
        buffer.readUInt8(); // Skip key action id
        this.keymapIndex = buffer.readUInt8();
    }

    private fromBinaryV6(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): void {
        this.fromBinaryV1(buffer);
        this.rgbColorFromBinary(buffer, serialisationInfo);
    }
}

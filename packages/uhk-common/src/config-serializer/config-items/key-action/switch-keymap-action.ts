import { assertUInt8 } from '../../assert';
import { UhkBuffer } from '../../uhk-buffer';
import { Keymap } from '../keymap';
import { KeyAction, KeyActionId, keyActionType } from './key-action';
import { UserConfiguration } from '../user-configuration';

export class SwitchKeymapAction extends KeyAction {

    keymapAbbreviation: string;

    constructor(parameter?: SwitchKeymapAction | Keymap | string) {
        super();
        if (!parameter) {
            return;
        }
        if (parameter instanceof SwitchKeymapAction) {
            this.keymapAbbreviation = parameter.keymapAbbreviation;
        } else if (parameter instanceof Keymap) {
            this.keymapAbbreviation = parameter.abbreviation;
        } else {
            this.keymapAbbreviation = parameter;
        }
    }

    fromJsonObject(jsonObject: any, version: number): SwitchKeymapAction {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
                this.fromJsonObjectV1(jsonObject);
                break;

            default:
                throw new Error(`Switch keymap action does not support version: ${version}`);
        }

        return this;
    }

    toJsonObject(): any {
        return {
            keyActionType: keyActionType.SwitchKeymapAction,
            keymapAbbreviation: this.keymapAbbreviation
        };
    }

    toBinary(buffer: UhkBuffer, userConfiguration: UserConfiguration): void {
        const keymapIndex = userConfiguration.keymaps.findIndex(keymap => keymap.abbreviation === this.keymapAbbreviation);
        buffer.writeUInt8(KeyActionId.SwitchKeymapAction);
        buffer.writeUInt8(keymapIndex);
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
}

export class UnresolvedSwitchKeymapAction extends KeyAction {

    @assertUInt8 keymapIndex: number;

    constructor(keymapIndex?: number) {
        super();
        this.keymapIndex = keymapIndex;
    }

    fromBinary(buffer: UhkBuffer, version: number): UnresolvedSwitchKeymapAction {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
                this.fromBinaryV1(buffer);
                break;

            default:
                throw new Error(`Unresolved switch keymap action does not support version: ${version}`);
        }

        return this;
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.SwitchKeymapAction);
        buffer.writeUInt8(this.keymapIndex);
    }

    toJsonObject(): any {
        throw new Error('UnresolvedSwitchKeymapAction cannot be serialized directly. Convert it to SwitchKeymapAction first.');
    }

    resolve(keymaps: Keymap[]): SwitchKeymapAction {
        return new SwitchKeymapAction(keymaps[this.keymapIndex]);
    }

    public getName(): string {
        return 'UnresolvedSwitchKeymapAction';
    }

    private fromBinaryV1(buffer: UhkBuffer): void {
        buffer.readUInt8(); // Skip key action id
        this.keymapIndex = buffer.readUInt8();
    }
}

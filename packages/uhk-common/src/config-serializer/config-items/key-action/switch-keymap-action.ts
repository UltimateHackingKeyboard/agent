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

    fromJsonObject(jsonObject: any): SwitchKeymapAction {
        this.assertKeyActionType(jsonObject);
        this.keymapAbbreviation = jsonObject.keymapAbbreviation;
        return this;
    }

    toJsonObject(): any {
        return {
            keyActionType: keyActionType.SwitchKeymapAction,
            keymapAbbreviation: this.keymapAbbreviation
        };
    }

    // TODO: New method pls check UnresolvedSwitchKeymapAction TODO
    fromBinary(buffer: UhkBuffer, userConfiguration: UserConfiguration): SwitchKeymapAction {
        buffer.readUInt8(); // Skip key action id
        const keymapIndex = buffer.readUInt8();
        this.keymapAbbreviation = userConfiguration.keymaps[keymapIndex].abbreviation;
        return this;
    }

    toBinary(buffer: UhkBuffer, userConfiguration: UserConfiguration): void {
        const keymapIndex = userConfiguration.keymaps.findIndex(keymap => keymap.abbreviation === this.keymapAbbreviation);
        buffer.writeUInt8(KeyActionId.SwitchKeymapAction);
        buffer.writeUInt8(keymapIndex);
    }

    toString(): string {
        return `<SwitchKeymapAction keymapAbbreviation="${this.keymapAbbreviation}">`;
    }

    // TODO: It is a bad pattern the method should have same behavior
    // Not good if sometimes return with the same keymap and sometime a new instance
    // for the consistent behavior it should be throw and error if
    // oldAbbr not equal with current keymapAbbreviation
    renameKeymap(oldAbbr: string, newAbbr: string): KeyAction {
        if (this.keymapAbbreviation !== oldAbbr) {
            return this;
        }
        return new SwitchKeymapAction(newAbbr);
    }

    public getName(): string {
        return 'SwitchKeymapAction';
    }
}

// TODO: This is unnecessary object.
// move the fromBinary() method to the SwitchKeymapAction
// and append the resolve() method logic to the new fromBinary()
// I checked and hard to delete this class.
export class UnresolvedSwitchKeymapAction extends KeyAction {

    @assertUInt8
    keymapIndex: number;

    constructor(keymapIndex?: number) {
        super();
        this.keymapIndex = keymapIndex;
    }

    fromBinary(buffer: UhkBuffer): UnresolvedSwitchKeymapAction {
        buffer.readUInt8(); // Skip key action id
        this.keymapIndex = buffer.readUInt8();
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
}

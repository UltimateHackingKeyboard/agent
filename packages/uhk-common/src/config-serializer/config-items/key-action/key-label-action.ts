import { UhkBuffer } from '../../uhk-buffer.js';
import { KeyActionId } from './key-action.js';
import { keyActionType } from './key-action.js';
import { KeyAction } from './key-action.js';

export class KeyLabelAction extends KeyAction {

    label: string;

    constructor(other?: KeyLabelAction) {
        super(other);

        if (other) {
            this.label = other.label;
        }
    }

    fromJsonObject(jsonObject: any): KeyLabelAction {
        this.assertKeyActionType(jsonObject);
        this.label = jsonObject.label;

        return this;
    }

    fromBinary(buffer: UhkBuffer): KeyLabelAction {
        this.readAndAssertKeyActionId(buffer);
        this.label = buffer.readString();

        return this;
    }

    toJsonObject(): any {
        return {
            keyActionType: keyActionType.KeyLabelAction,
            label: this.label,
        };
    }

    toBinary(buffer: UhkBuffer): void {
        buffer.writeUInt8(KeyActionId.KeyLabelAction);
        buffer.writeString(this.label);
    }

    toString(): string {
        return `<KeyLabelAction label="${this.label}">`;
    }

    public getName(): string {
        return 'KeyLabelAction';
    }
}

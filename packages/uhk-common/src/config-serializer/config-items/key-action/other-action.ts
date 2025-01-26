import { assertEnum } from '../../assert.js';
import { UhkBuffer } from '../../uhk-buffer.js';
import { SerialisationInfo } from '../serialisation-info.js';
import { KeyActionId } from './key-action.js';
import { keyActionType } from './key-action.js';
import { KeyAction } from './key-action.js';

export enum OtherActionSubTypes {
    Sleep = 0,
}

export class OtherAction extends KeyAction {
    @assertEnum(OtherActionSubTypes) actionSubtype: OtherActionSubTypes;

    constructor(other?: OtherAction) {
        super(other);
        if (!other) {
            return
        }

        this.actionSubtype = other.actionSubtype
    }

    fromJsonObject(jsonObject: any, serialisationInfo: SerialisationInfo): OtherAction {
        this.assertKeyActionType(jsonObject);
        this.actionSubtype = OtherActionSubTypes[<string>jsonObject.actionSubtype];
        this.rgbColorFromJson(jsonObject, serialisationInfo);

        return this;
    }

    fromBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): OtherAction {
        this.readAndAssertKeyActionId(buffer);
        this.actionSubtype = buffer.readUInt8();
        this.rgbColorFromBinary(buffer, serialisationInfo);

        return this;
    }

    toJsonObject(serialisationInfo: SerialisationInfo) {
        return {
            keyActionType: keyActionType.OtherAction,
            actionSubtype: OtherActionSubTypes[this.actionSubtype],
            ...this.rgbColorToJson(serialisationInfo)
        }
    }

    toBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): void {
        buffer.writeUInt8(KeyActionId.OtherAction);
        buffer.writeUInt8(this.actionSubtype);
        this.rgbColorToBinary(buffer, serialisationInfo);
    }

    getName(): string {
        return 'OtherAction';
    }

    toString(): string {
        return `<OtherAction actionSubtype="${this.actionSubtype}">`;
    }
}

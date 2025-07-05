import { assertUInt8 } from '../../assert.js';
import { UhkBuffer } from '../../uhk-buffer.js';
import { SerialisationInfo } from '../serialisation-info.js';
import { KeyAction, KeyActionId, keyActionType } from './key-action.js';

/**
 * NoneBlockAction is only intended for binary serialization
 * DO NOT use it as a real KeyAction
 */

export class NoneBlockAction extends KeyAction {

    @assertUInt8 blockCount: number = 0;

    constructor(other?: NoneBlockAction) {
        super(other);

        if (!other) {
            return
        }

        this.blockCount = other.blockCount
    }

    fromJsonObject(jsonObject: any, serialisationInfo: SerialisationInfo): NoneBlockAction {
        this.assertKeyActionType(jsonObject);
        this.blockCount = jsonObject.blockCount;
        this.rgbColorFromJson(jsonObject, serialisationInfo);

        return this;
    }

    fromBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): NoneBlockAction {
        this.readAndAssertKeyActionId(buffer);
        this.blockCount = buffer.readUInt8();
        this.rgbColorFromBinary(buffer, serialisationInfo);

        return this;
    }

    toJsonObject(serialisationInfo: SerialisationInfo): any {
        return {
            keyActionType: keyActionType.NoneBlockAction,
            blockCount: this.blockCount,
            ...this.rgbColorToJson(serialisationInfo)
        };
    }

    toBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): void {
        buffer.writeUInt8(KeyActionId.NoneBlockAction);
        buffer.writeUInt8(this.blockCount)
        this.rgbColorToBinary(buffer, serialisationInfo);
    }

    toString(): string {
        return '<NoneBlockAction>';
    }

    public getName(): string {
        return 'NoneBlockAction';
    }
}

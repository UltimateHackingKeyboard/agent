import { RgbColorInterface } from '../../../models/index.js';
import { UhkBuffer } from '../../uhk-buffer.js';
import { SerialisationInfo } from '../serialisation-info.js';
import { KeyAction, KeyActionId, keyActionType } from './key-action.js';

/**
 * NoneAction is only intended for binary serialization of undefined key actions
 * DO NOT use it as a real KeyAction
 *
 */

export class NoneAction extends KeyAction {

    constructor(other?: NoneAction | RgbColorInterface) {
        super(other);
    }

    fromJsonObject(jsonObject: any, serialisationInfo: SerialisationInfo): NoneAction {
        this.assertKeyActionType(jsonObject);
        this.rgbColorFromJson(jsonObject, serialisationInfo);

        return this;
    }

    fromBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): NoneAction {
        this.readAndAssertKeyActionId(buffer);
        this.rgbColorFromBinary(buffer, serialisationInfo);

        return this;
    }

    toJsonObject(serialisationInfo: SerialisationInfo): any {
        return {
            keyActionType: keyActionType.NoneAction,
            ...this.rgbColorToJson(serialisationInfo)
        };
    }

    toBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): void {
        buffer.writeUInt8(KeyActionId.NoneAction);
        this.rgbColorToBinary(buffer, serialisationInfo);
    }

    toString(): string {
        return '<NoneAction>';
    }

    public getName(): string {
        return 'NoneAction';
    }
}

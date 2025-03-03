import { RgbColorInterface } from '../../../models/index.js';
import { UhkBuffer } from '../../uhk-buffer.js';
import { SerialisationInfo } from '../serialisation-info.js';
import { UserConfiguration } from '../user-configuration.js';
import { keyActionType } from './key-action.js';
import { KeyAction } from './key-action.js';

export class SpecialAction extends KeyAction {

    constructor(other?: SpecialAction | RgbColorInterface) {
        super(other);
    }

    fromJsonObject(jsonObject: any, serialisationInfo: SerialisationInfo): SpecialAction {
        this.assertKeyActionType(jsonObject);

        return this;
    }

    fromBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): SpecialAction {
        return this;
    }

    toJsonObject(serialisationInfo: SerialisationInfo) {
        return {
            keyActionType: keyActionType.SpecialAction,
        };
    }

    toBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo, userConfiguration?: UserConfiguration): void {
    }

    getName(): string {
        return 'SpecialAction';
    }

    toString(): string {
        return '<SpecialAction>';
    }

}

import { UhkBuffer } from '../../UhkBuffer';
import { KeyAction, KeyActionId, keyActionType } from './KeyAction';

/**
 * NoneAction is only intended for binary serialization of undefined key actions
 * DO NOT use it as a real KeyAction
 *
 */

export class NoneAction extends KeyAction {

    fromJsonObject(jsonObject: any): NoneAction {
        this.assertKeyActionType(jsonObject);
        return this;
    }

    fromBinary(buffer: UhkBuffer): NoneAction {
        this.readAndAssertKeyActionId(buffer);
        return this;
    }

    _toJsonObject(): any {
        return {
            keyActionType: keyActionType.NoneAction
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.NoneAction);
    }

    toString(): string {
        return '<NoneAction>';
    }
}

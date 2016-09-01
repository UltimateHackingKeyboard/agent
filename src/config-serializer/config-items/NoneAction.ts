import {keyActionType, KeyActionId, KeyAction} from './KeyAction';
import {UhkBuffer} from '../UhkBuffer';

export class NoneAction extends KeyAction {

    _fromJsObject(jsObject: any): NoneAction {
        this.assertKeyActionType(jsObject);
        return this;
    }

    _fromBinary(buffer: UhkBuffer): NoneAction {
        this.readAndAssertKeyActionId(buffer);
        return this;
    }

    _toJsObject(): any {
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

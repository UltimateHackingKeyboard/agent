import {UhkBuffer} from '../UhkBuffer';
import {keyActionType, KeyActionId, KeyAction} from './KeyAction';

export class KeystrokeAction extends KeyAction {

    // @assertUInt8
    scancode: number;

    _fromJsObject(jsObject: any): KeystrokeAction {
        this.assertKeyActionType(jsObject);
        this.scancode = jsObject.scancode;
        return this;
    }

    _fromBinary(buffer: UhkBuffer): KeystrokeAction {
        this.readAndAssertKeyActionId(buffer);
        this.scancode = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            keyActionType: keyActionType.KeystrokeAction,
            scancode: this.scancode
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.KeystrokeAction);
        buffer.writeUInt8(this.scancode);
    }

    toString(): string {
        return `<KeystrokeAction scancode="${this.scancode}">`;
    }
}

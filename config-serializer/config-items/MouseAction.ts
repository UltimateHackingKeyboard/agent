import {keyActionType, KeyActionId, KeyAction} from './KeyAction';
import {UhkBuffer} from '../UhkBuffer';
import {assertEnum} from '../assert';

enum MouseActionParam {
    leftClick,
    middleClick,
    rightClick,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    scrollUp,
    scrollDown,
    scrollLeft,
    scrollRight,
    accelerate,
    decelerate
}

export class MouseAction extends KeyAction {

    @assertEnum(MouseActionParam)
    mouseAction: MouseActionParam;

    _fromJsObject(jsObject: any): MouseAction {
        this.assertKeyActionType(jsObject);
        this.mouseAction = MouseActionParam[<string> jsObject.mouseAction];
        return this;
    }

    _fromBinary(buffer: UhkBuffer): MouseAction {
        this.readAndAssertKeyActionId(buffer);
        this.mouseAction = buffer.readUInt8();
        return this;
    }

    _toJsObject(): any {
        return {
            keyActionType: keyActionType.MouseAction,
            mouseAction: MouseActionParam[this.mouseAction]
        };
    }

    _toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.MouseAction);
        buffer.writeUInt8(this.mouseAction);
    }

    toString(): string {
        return `<MouseAction mouseAction="${this.mouseAction}">`;
    }
}

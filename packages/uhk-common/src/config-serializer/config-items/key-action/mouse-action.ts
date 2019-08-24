import { assertEnum } from '../../assert';
import { UhkBuffer } from '../../uhk-buffer';
import { KeyAction, KeyActionId, keyActionType } from './key-action';

export enum MouseActionParam {
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
    decelerate,
    button4,
    button5,
    button6,
    button7,
    button8
}

export class MouseAction extends KeyAction {

    @assertEnum(MouseActionParam)
    mouseAction: MouseActionParam;

    constructor(other?: MouseAction) {
        super();
        if (!other) {
            return;
        }
        this.mouseAction = other.mouseAction;
    }

    fromJsonObject(jsObject: any): MouseAction {
        this.assertKeyActionType(jsObject);
        this.mouseAction = MouseActionParam[<string>jsObject.mouseAction];
        return this;
    }

    fromBinary(buffer: UhkBuffer): MouseAction {
        this.readAndAssertKeyActionId(buffer);
        this.mouseAction = buffer.readUInt8();
        return this;
    }

    toJsonObject(): any {
        return {
            keyActionType: keyActionType.MouseAction,
            mouseAction: MouseActionParam[this.mouseAction]
        };
    }

    toBinary(buffer: UhkBuffer) {
        buffer.writeUInt8(KeyActionId.MouseAction);
        buffer.writeUInt8(this.mouseAction);
    }

    toString(): string {
        return `<MouseAction mouseAction="${this.mouseAction}">`;
    }

    public getName(): string {
        return 'MouseAction';
    }
}

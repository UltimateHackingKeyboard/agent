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

    @assertEnum(MouseActionParam) mouseAction: MouseActionParam;

    constructor(other?: MouseAction) {
        super();
        if (!other) {
            return;
        }
        this.mouseAction = other.mouseAction;
    }

    fromJsonObject(jsonObject: any, version: number): MouseAction {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
                this.fromJsonObjectV1(jsonObject);
                break;

            default:
                throw new Error(`Mouse action does not support version: ${version}`);
        }

        return this;
    }

    fromBinary(buffer: UhkBuffer, version: number): MouseAction {
        switch (version) {
            case 1:
            case 2:
            case 3:
            case 4:
                this.fromBinaryV1(buffer);
                break;

            default:
                throw new Error(`Mouse action does not support version: ${version}`);
        }

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

    private fromJsonObjectV1(jsObject: any): MouseAction {
        this.assertKeyActionType(jsObject);
        this.mouseAction = MouseActionParam[<string>jsObject.mouseAction];
        return this;
    }

    private fromBinaryV1(buffer: UhkBuffer): MouseAction {
        this.readAndAssertKeyActionId(buffer);
        this.mouseAction = buffer.readUInt8();
        return this;
    }
}

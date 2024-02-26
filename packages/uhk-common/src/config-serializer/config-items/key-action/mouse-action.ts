import { assertEnum } from '../../assert.js';
import { UhkBuffer } from '../../uhk-buffer.js';
import { SerialisationInfo } from '../serialisation-info.js';
import { KeyAction, KeyActionId, keyActionType } from './key-action.js';

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
        super(other);
        if (!other) {
            return;
        }
        this.mouseAction = other.mouseAction;
    }

    fromJsonObject(jsonObject: any, serialisationInfo: SerialisationInfo): MouseAction {
        switch (serialisationInfo.userConfigMajorVersion) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                this.fromJsonObjectV1(jsonObject);
                break;

            case 6:
            case 7:
                this.fromJsonObjectV6(jsonObject, serialisationInfo);
                break;

            default:
                throw new Error(`Mouse action does not support version: ${serialisationInfo.userConfigMajorVersion}`);
        }

        return this;
    }

    fromBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): MouseAction {
        switch (serialisationInfo.userConfigMajorVersion) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                this.fromBinaryV1(buffer);
                break;

            case 6:
            case 7:
                this.fromBinaryV6(buffer, serialisationInfo);
                break;

            default:
                throw new Error(`Mouse action does not support version: ${serialisationInfo.userConfigMajorVersion}`);
        }

        return this;
    }

    toJsonObject(serialisationInfo: SerialisationInfo): any {
        return {
            keyActionType: keyActionType.MouseAction,
            mouseAction: MouseActionParam[this.mouseAction],
            ...this.rgbColorToJson(serialisationInfo)
        };
    }

    toBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo) {
        buffer.writeUInt8(KeyActionId.MouseAction);
        buffer.writeUInt8(this.mouseAction);
        this.rgbColorToBinary(buffer, serialisationInfo);
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

    private fromJsonObjectV6(jsObject: any, serialisationInfo: SerialisationInfo): void {
        this.fromJsonObjectV1(jsObject);
        this.rgbColorFromJson(jsObject, serialisationInfo);
    }

    private fromBinaryV1(buffer: UhkBuffer): MouseAction {
        this.readAndAssertKeyActionId(buffer);
        this.mouseAction = buffer.readUInt8();
        return this;
    }

    private fromBinaryV6(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): void {
        this.fromBinaryV1(buffer);
        this.rgbColorFromBinary(buffer, serialisationInfo);
    }
}

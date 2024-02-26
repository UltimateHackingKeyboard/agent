import { assertEnum } from '../../assert.js';
import { UhkBuffer } from '../../uhk-buffer.js';
import { SerialisationInfo } from '../serialisation-info.js';
import { KeyAction, KeyActionId, keyActionType } from './key-action.js';
import { LayerName } from '../layer-name.js';

export enum SwitchLayerMode {
    holdAndDoubleTapToggle = 'holdAndDoubleTapToggle',
    toggle = 'toggle',
    hold = 'hold'
}

export const mapSwitchLayerModeToNumber = (switchLayerMode: SwitchLayerMode): number => {
    switch (switchLayerMode) {
        case SwitchLayerMode.holdAndDoubleTapToggle:
            return 0;

        case SwitchLayerMode.toggle:
            return 1;

        case SwitchLayerMode.hold:
            return 2;

        default:
            throw new Error(`Can not map ${switchLayerMode} to number`);
    }
};

export const mapNumberToSwitchLayerMode = (value: number): SwitchLayerMode => {
    switch (value) {
        case 0:
            return SwitchLayerMode.holdAndDoubleTapToggle;

        case 1:
            return SwitchLayerMode.toggle;

        case 2:
            return SwitchLayerMode.hold;

        default:
            throw new Error(`Can not map "${value}" to SwitchLayerMode`);
    }
};

export class SwitchLayerAction extends KeyAction {

    @assertEnum(SwitchLayerMode) switchLayerMode: SwitchLayerMode;

    @assertEnum(LayerName) layer: LayerName;

    constructor(other?: SwitchLayerAction) {
        super(other);
        if (!other) {
            return;
        }
        this.switchLayerMode = other.switchLayerMode;
        this.layer = other.layer;
    }

    fromJsonObject(jsonObject: any, serialisationInfo: SerialisationInfo): SwitchLayerAction {
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
                throw new Error(`Layer switch action does not support version: ${serialisationInfo.userConfigMajorVersion}`);
        }

        return this;
    }

    fromBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): SwitchLayerAction {
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
                throw new Error(`Layer switch action does not support version: ${serialisationInfo.userConfigMajorVersion}`);
        }

        return this;
    }

    toJsonObject(serialisationInfo: SerialisationInfo): any {
        return {
            keyActionType: keyActionType.SwitchLayerAction,
            layer: LayerName[this.layer],
            switchLayerMode: this.switchLayerMode,
            ...this.rgbColorToJson(serialisationInfo)
        };
    }

    toBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): void {
        buffer.writeUInt8(KeyActionId.SwitchLayerAction);
        buffer.writeUInt8(this.layer);
        buffer.writeUInt8(mapSwitchLayerModeToNumber(this.switchLayerMode));
        this.rgbColorToBinary(buffer, serialisationInfo);
    }

    toString(): string {
        return `<SwitchLayerAction layer="${this.layer}" switchLayerMode="${this.switchLayerMode}">`;
    }

    public getName(): string {
        return 'SwitchLayerAction';
    }

    private fromJsonObjectV1(jsonObject: any): void {
        this.assertKeyActionType(jsonObject);
        this.layer = LayerName[<string>jsonObject.layer];

        // Backward compatibility when "switchLayerMode" was a boolean type as "toggle"
        if (typeof jsonObject.toggle === 'boolean') {
            this.switchLayerMode = jsonObject.toggle ? SwitchLayerMode.toggle : SwitchLayerMode.holdAndDoubleTapToggle;
        }
        else {
            this.switchLayerMode = jsonObject.switchLayerMode;
        }
    }

    private fromJsonObjectV6(jsonObject: any, serialisationInfo: SerialisationInfo): void {
        this.fromJsonObjectV1(jsonObject);
        this.rgbColorFromJson(jsonObject, serialisationInfo);
    }

    private fromBinaryV1(buffer: UhkBuffer): void {
        this.readAndAssertKeyActionId(buffer);
        this.layer = buffer.readUInt8();
        this.switchLayerMode = mapNumberToSwitchLayerMode(buffer.readUInt8());
    }

    private fromBinaryV6(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): void {
        this.fromBinaryV1(buffer);
        this.rgbColorFromBinary(buffer, serialisationInfo);
    }
}

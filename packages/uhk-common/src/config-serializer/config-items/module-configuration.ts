import { assertEnum, assertFloat, assertUInt16 } from '../assert.js';
import { UhkBuffer } from '../uhk-buffer.js';
import { ModuleId } from './module-configuration/module-id.js';
import { TouchpadProperty } from './module-configuration/module-property.js';
import { KeyClusterProperty } from './module-configuration/module-property.js';
import { ModuleProperty } from './module-configuration/module-property.js';
import { NavigationMode } from './module-configuration/navigation-mode.js';
import { SerialisationInfo } from './serialisation-info.js';

export class ModuleConfiguration {

    @assertEnum(ModuleId) id: ModuleId;

    @assertEnum(NavigationMode) navigationModeBaseLayer: NavigationMode;
    @assertEnum(NavigationMode) navigationModeModLayer: NavigationMode;
    @assertEnum(NavigationMode) navigationModeFnLayer: NavigationMode;
    @assertEnum(NavigationMode) navigationModeMouseLayer: NavigationMode;
    @assertEnum(NavigationMode) navigationModeFn2Layer: NavigationMode;
    @assertEnum(NavigationMode) navigationModeFn3Layer: NavigationMode;
    @assertEnum(NavigationMode) navigationModeFn4Layer: NavigationMode;
    @assertEnum(NavigationMode) navigationModeFn5Layer: NavigationMode;

    @assertFloat speed: number;
    @assertFloat baseSpeed: number;
    @assertFloat xceleration: number;

    @assertUInt16 scrollSpeedDivisor: number;
    @assertUInt16 caretSpeedDivisor: number;

    scrollAxisLock: boolean;
    caretAxisLock: boolean;
    @assertFloat axisLockFirstTickSkew: number;
    @assertFloat axisLockSkew: number;

    invertScrollDirectionY: boolean;

    // Key cluster
    keyClusterSwapAxes: boolean;
    keyClusterInvertHorizontalScrolling: boolean;

    // Touchpad
    @assertUInt16 touchpadPinchZoomDivisor: number;
    @assertUInt16 touchpadHoldContinuationTimeout: number;
    @assertEnum(NavigationMode) touchpadPinchToZoom: NavigationMode = NavigationMode.Zoom;

    constructor(other?: ModuleConfiguration) {
        if (!other) {
            return;
        }
        this.id = other.id;

        this.navigationModeBaseLayer = other.navigationModeBaseLayer;
        this.navigationModeModLayer = other.navigationModeModLayer;
        this.navigationModeFnLayer = other.navigationModeFnLayer;
        this.navigationModeMouseLayer = other.navigationModeMouseLayer;
        this.navigationModeFn2Layer = other.navigationModeFn2Layer;
        this.navigationModeFn3Layer = other.navigationModeFn3Layer;
        this.navigationModeFn4Layer = other.navigationModeFn4Layer;
        this.navigationModeFn5Layer = other.navigationModeFn5Layer;

        this.speed = other.speed;
        this.baseSpeed = other.baseSpeed;
        this.xceleration = other.xceleration;

        this.scrollSpeedDivisor = other.scrollSpeedDivisor;
        this.caretSpeedDivisor = other.caretSpeedDivisor;

        this.scrollAxisLock = other.scrollAxisLock;
        this.caretAxisLock = other.caretAxisLock;
        this.axisLockFirstTickSkew = other.axisLockFirstTickSkew;
        this.axisLockSkew = other.axisLockSkew;

        this.invertScrollDirectionY = other.invertScrollDirectionY;

        this.keyClusterSwapAxes = other.keyClusterSwapAxes;
        this.keyClusterInvertHorizontalScrolling = other.keyClusterInvertHorizontalScrolling;

        this.touchpadPinchZoomDivisor = other.touchpadPinchZoomDivisor;
        this.touchpadHoldContinuationTimeout = other.touchpadHoldContinuationTimeout;
        this.touchpadPinchToZoom = other.touchpadPinchToZoom;
    }

    fromJsonObject(jsonObject: any, serialisationInfo: SerialisationInfo): ModuleConfiguration {
        switch (serialisationInfo.userConfigMajorVersion) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                break;

            case 7:
                this.fromJsonObjectV7(jsonObject);
                break;

            default:
                throw new Error(`Module configuration does not support version: ${serialisationInfo.userConfigMajorVersion}`);
        }

        return this;
    }

    fromBinary(buffer: UhkBuffer, serialisationInfo: SerialisationInfo): ModuleConfiguration {
        switch (serialisationInfo.userConfigMajorVersion) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                break;

            case 7:
                this.fromBinaryV7(buffer);
                break;

            default:
                throw new Error(`Module configuration does not support version: ${serialisationInfo.userConfigMajorVersion}`);
        }

        return this;
    }

    toJsonObject(): any {
        const json: any = {
            id: ModuleId[this.id],

            navigationModeBaseLayer: NavigationMode[this.navigationModeBaseLayer],
            navigationModeModLayer: NavigationMode[this.navigationModeModLayer],
            navigationModeFnLayer: NavigationMode[this.navigationModeFnLayer],
            navigationModeMouseLayer: NavigationMode[this.navigationModeMouseLayer],
            navigationModeFn2Layer: NavigationMode[this.navigationModeFn2Layer],
            navigationModeFn3Layer: NavigationMode[this.navigationModeFn3Layer],
            navigationModeFn4Layer: NavigationMode[this.navigationModeFn4Layer],
            navigationModeFn5Layer: NavigationMode[this.navigationModeFn5Layer],

            speed: this.speed,
            baseSpeed: this.baseSpeed,
            xceleration: this.xceleration,
            scrollSpeedDivisor: this.scrollSpeedDivisor,
            caretSpeedDivisor: this.caretSpeedDivisor,
            scrollAxisLock: this.scrollAxisLock,
            caretAxisLock: this.caretAxisLock,
            axisLockFirstTickSkew: this.axisLockFirstTickSkew,
            axisLockSkew: this.axisLockSkew,
            invertScrollDirectionY: this.invertScrollDirectionY,
        };

        if (this.id === ModuleId.KeyClusterLeft){
            json.keyClusterSwapAxes = this.keyClusterSwapAxes;
            json.keyClusterInvertHorizontalScrolling = this.keyClusterInvertHorizontalScrolling;
        } else if (this.id === ModuleId.TouchpadRight){
            json.touchpadPinchZoomDivisor = this.touchpadPinchZoomDivisor;
            json.touchpadHoldContinuationTimeout = this.touchpadHoldContinuationTimeout;
            json.touchpadPinchToZoom = NavigationMode[this.touchpadPinchToZoom];
        }

        return json;
    }

    toBinary(buffer: UhkBuffer): void {
        buffer.writeUInt8(this.id);

        buffer.writeUInt8(this.navigationModeBaseLayer);
        buffer.writeUInt8(this.navigationModeModLayer);
        buffer.writeUInt8(this.navigationModeFnLayer);
        buffer.writeUInt8(this.navigationModeMouseLayer);
        buffer.writeUInt8(this.navigationModeFn2Layer);
        buffer.writeUInt8(this.navigationModeFn3Layer);
        buffer.writeUInt8(this.navigationModeFn4Layer);
        buffer.writeUInt8(this.navigationModeFn5Layer);

        let numberOfProperties = 10;
        if (this.id === ModuleId.KeyClusterLeft){
            numberOfProperties += 2;
        }  else if (this.id === ModuleId.TouchpadRight){
            numberOfProperties += 3;
        }

        buffer.writeUInt8(numberOfProperties);

        buffer.writeUInt8(ModuleProperty.Speed);
        buffer.writeFloat(this.speed);
        buffer.writeUInt8(ModuleProperty.BaseSpeed);
        buffer.writeFloat(this.baseSpeed);
        buffer.writeUInt8(ModuleProperty.Xceleration);
        buffer.writeFloat(this.xceleration);
        buffer.writeUInt8(ModuleProperty.ScrollSpeedDivisor);
        buffer.writeUInt16(this.scrollSpeedDivisor);
        buffer.writeUInt8(ModuleProperty.CaretSpeedDivisor);
        buffer.writeUInt16(this.caretSpeedDivisor);
        buffer.writeUInt8(ModuleProperty.ScrollAxisLock);
        buffer.writeBoolean(this.scrollAxisLock);
        buffer.writeUInt8(ModuleProperty.CaretAxisLock);
        buffer.writeBoolean(this.caretAxisLock);
        buffer.writeUInt8(ModuleProperty.AxisLockFirstTickSkew);
        buffer.writeFloat(this.axisLockFirstTickSkew);
        buffer.writeUInt8(ModuleProperty.AxisLockSkew);
        buffer.writeFloat(this.axisLockSkew);
        buffer.writeUInt8(ModuleProperty.InvertScrollDirectionY);
        buffer.writeBoolean(this.invertScrollDirectionY);

        if (this.id === ModuleId.KeyClusterLeft){
            buffer.writeUInt8(KeyClusterProperty.SwapAxes);
            buffer.writeBoolean(this.keyClusterSwapAxes);
            buffer.writeUInt8(KeyClusterProperty.InvertScrollDirectionX);
            buffer.writeBoolean(this.keyClusterInvertHorizontalScrolling);
        } else if (this.id === ModuleId.TouchpadRight){
            buffer.writeUInt8(TouchpadProperty.PinchZoomSpeedDivisor);
            buffer.writeUInt16(this.touchpadPinchZoomDivisor);
            buffer.writeUInt8(TouchpadProperty.PinchZoomMode);
            buffer.writeUInt8(this.touchpadPinchToZoom);
            buffer.writeUInt8(TouchpadProperty.HoldContinuationTimeout);
            buffer.writeUInt16(this.touchpadHoldContinuationTimeout);
        }

    }

    toString(): string {
        return `<ModuleConfiguration id="${this.id}" >`;
    }

    private fromJsonObjectV7(jsonObject: any): void {
        this.id = ModuleId[jsonObject.id as string];

        this.navigationModeBaseLayer = NavigationMode[jsonObject.navigationModeBaseLayer as string];
        this.navigationModeModLayer = NavigationMode[jsonObject.navigationModeModLayer as string];
        this.navigationModeFnLayer = NavigationMode[jsonObject.navigationModeFnLayer as string];
        this.navigationModeMouseLayer = NavigationMode[jsonObject.navigationModeMouseLayer as string];
        this.navigationModeFn2Layer = NavigationMode[jsonObject.navigationModeFn2Layer as string];
        this.navigationModeFn3Layer = NavigationMode[jsonObject.navigationModeFn3Layer as string];
        this.navigationModeFn4Layer = NavigationMode[jsonObject.navigationModeFn4Layer as string];
        this.navigationModeFn5Layer = NavigationMode[jsonObject.navigationModeFn5Layer as string];

        this.speed = jsonObject.speed;
        this.baseSpeed = jsonObject.baseSpeed;
        this.xceleration = jsonObject.xceleration;
        this.scrollSpeedDivisor = jsonObject.scrollSpeedDivisor;
        this.caretSpeedDivisor = jsonObject.caretSpeedDivisor;
        this.scrollAxisLock = jsonObject.scrollAxisLock;
        this.caretAxisLock = jsonObject.caretAxisLock;
        this.axisLockFirstTickSkew = jsonObject.axisLockFirstTickSkew;
        this.axisLockSkew = jsonObject.axisLockSkew;
        this.invertScrollDirectionY = jsonObject.invertScrollDirectionY;

        if (this.id === ModuleId.KeyClusterLeft){
            this.keyClusterSwapAxes = jsonObject.keyClusterSwapAxes;
            this.keyClusterInvertHorizontalScrolling = jsonObject.keyClusterInvertHorizontalScrolling;
        } else if (this.id === ModuleId.TouchpadRight){
            this.touchpadPinchZoomDivisor = jsonObject.touchpadPinchZoomDivisor;
            this.touchpadHoldContinuationTimeout = jsonObject.touchpadHoldContinuationTimeout;
            this.touchpadPinchToZoom = NavigationMode[jsonObject.touchpadPinchToZoom as string];
        }
    }

    private fromBinaryV7(buffer: UhkBuffer): void {
        this.id = buffer.readUInt8();

        this.navigationModeBaseLayer = buffer.readUInt8();
        this.navigationModeModLayer = buffer.readUInt8();
        this.navigationModeFnLayer = buffer.readUInt8();
        this.navigationModeMouseLayer = buffer.readUInt8();
        this.navigationModeFn2Layer = buffer.readUInt8();
        this.navigationModeFn3Layer = buffer.readUInt8();
        this.navigationModeFn4Layer = buffer.readUInt8();
        this.navigationModeFn5Layer = buffer.readUInt8();

        let numberOfProperties = buffer.readUInt8();

        for(let index = 0; index < numberOfProperties; index++){
            const property = buffer.readUInt8();
            switch (property) {
                case ModuleProperty.Speed:
                    this.speed = buffer.readFloat();
                    break;
                case ModuleProperty.BaseSpeed:
                    this.baseSpeed = buffer.readFloat();
                    break;
                case ModuleProperty.Xceleration:
                    this.xceleration = buffer.readFloat();
                    break;
                case ModuleProperty.ScrollSpeedDivisor:
                    this.scrollSpeedDivisor = buffer.readUInt16();
                    break;
                case ModuleProperty.CaretSpeedDivisor:
                    this.caretSpeedDivisor = buffer.readUInt16();
                    break;
                case ModuleProperty.ScrollAxisLock:
                    this.scrollAxisLock = buffer.readBoolean();
                    break;
                case ModuleProperty.CaretAxisLock:
                    this.caretAxisLock = buffer.readBoolean();
                    break;
                case ModuleProperty.AxisLockFirstTickSkew:
                    this.axisLockFirstTickSkew = buffer.readFloat();
                    break;
                case ModuleProperty.AxisLockSkew:
                    this.axisLockSkew = buffer.readFloat();
                    break;
                case ModuleProperty.InvertScrollDirectionY:
                    this.invertScrollDirectionY = buffer.readBoolean();
                    break;

                default: {
                    if (this.id === ModuleId.KeyClusterLeft){
                        switch (property) {
                            case KeyClusterProperty.SwapAxes:
                                this.keyClusterSwapAxes = buffer.readBoolean();
                                break;
                            case KeyClusterProperty.InvertScrollDirectionX:
                                this.keyClusterInvertHorizontalScrolling = buffer.readBoolean();
                                break;
                            default:
                                throw new Error(`Unsupported Key Cluster module property: ${property}`);
                        }
                    } else if (this.id === ModuleId.TouchpadRight){
                        switch (property) {
                            case TouchpadProperty.PinchZoomSpeedDivisor:
                                this.touchpadPinchZoomDivisor = buffer.readUInt16();
                                break;
                            case TouchpadProperty.PinchZoomMode:
                                this.touchpadPinchToZoom = buffer.readUInt8();
                                break;
                            case TouchpadProperty.HoldContinuationTimeout:
                                this.touchpadHoldContinuationTimeout = buffer.readUInt16();
                                break;

                            default:
                                throw new Error(`Unsupported Touchpad Right module property: ${property}`);
                        }
                    } else {
                        throw new Error(`Unsupported module: ${this.id}`);
                    }
                }
            }
        }
    }
}

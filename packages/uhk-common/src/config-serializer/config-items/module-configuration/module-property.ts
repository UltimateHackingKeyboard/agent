export enum ModuleProperty {
    Speed = 0,
    BaseSpeed = 1,
    Xceleration = 2,
    ScrollSpeedDivisor = 3,
    CaretSpeedDivisor = 4,
    AxisLockSkew = 5,
    AxisLockFirstTickSkew = 6,
    ScrollAxisLock = 7,
    CaretAxisLock = 8,
    InvertScrollDirectionY = 9,
    InvertScrollDirectionX = 10
}

export enum KeyClusterProperty  {
    SwapAxes = 254,
    /**
     * @deprecated use ModuleProperty.InvertScrollDirectionX instead
     */
    InvertScrollDirectionX = 255,
}

export type KeyClusterModuleProperty = ModuleProperty | KeyClusterProperty;

export enum TouchpadProperty  {
    PinchZoomSpeedDivisor = 253,
    PinchZoomMode = 254,
    HoldContinuationTimeout = 255,
}

export type TouchpadModuleProperty = ModuleProperty | TouchpadProperty;

export type AllModuleProperty = ModuleProperty | KeyClusterProperty | TouchpadProperty;

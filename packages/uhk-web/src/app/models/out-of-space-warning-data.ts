export enum OutOfSpaceWarningType {
    OutOfSpace,
    PerKeyBacklighting,
    RecoverableLEDSpace
}

export interface OutOfSpaceWarningData {
    type: OutOfSpaceWarningType;
    currentValue: number;
    maxValue: number;
    show: boolean;
}

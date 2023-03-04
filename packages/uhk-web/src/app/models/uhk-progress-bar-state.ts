export interface ProgressBar {
    minValue: number;
    maxValue: number;
    currentValue: number;
}

export interface UhkProgressBarState {
    progressBars: Array<ProgressBar>;
    text: string;
}

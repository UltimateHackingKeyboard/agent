export interface ProgressBar {
    color: string;
    minValue: number;
    maxValue: number;
    currentValue: number;
}

export interface UhkProgressBarState {
    progressBars: Array<ProgressBar>;
    text: string;
}

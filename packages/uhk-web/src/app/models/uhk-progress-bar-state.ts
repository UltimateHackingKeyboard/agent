export interface ProgressBar {
    color: string;
    minValue: number;
    maxValue: number;
    currentValue: number;
}

export interface ProgressBarLegend {
    color: string;
    text: string;
}

export interface UhkProgressBarState {
    legends: Array<ProgressBarLegend>
    progressBars: Array<ProgressBar>;
    text: string;
}

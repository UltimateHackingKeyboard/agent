import { forwardRef } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const noop = (_: any) => {
};

@Component({
    selector: 'fade-timeout-slider',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './fade-timeout-slider.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FadeTimeoutSliderComponent),
            multi: true
        }
    ],
})
export class FadeTimeoutSliderComponent implements ControlValueAccessor{
    isDisabled = false;

    sliderConfig = {
        format: {
            from: (value: number | string) => {
                if (typeof value === 'string') {
                    const [mins, secs] = value.split(':');

                    if (secs === undefined) {
                        return parseInt(mins, 10);
                    }

                    return parseInt(mins, 10) * 60 + parseInt(secs, 10);
                }

                return value;
            },
            to: (value: number) => {
                return this.formatToValue(value);
            }
        },
        pips: {
            density: 3,
            format: {
                // format special values
                to: (value: number) => {
                    switch (value) {
                        case 60:
                            return '1m';

                        case 600:
                            return '10m';

                        case 1800:
                            return '30m';

                        case 3600:
                            return '1h';

                        default:
                            return value;
                    }
                }
            },
            mode: 'range',
        },
        range: {
            min: [0], // from 0 to 60 sec the step is 1 sec
            '25%': [60, 5], // from 60 sec to 10 min the step is 5 sec
            '50%': [600, 60], // from 10 min to 30 min the step is 1 minute
            '75%': [1800, 60], // from 30 min to 60 min the step is 1 minute
            max: [3600], // max value is 1 hour
        },
        tooltips: [
            {
                to: (value) => {
                    return this.formatToValue(value);
                }
            }
        ]
    };

    private _model: string;
    private _onChanged = noop;
    private _onTouched = noop;

    get model(): string {
        return this._model;
    }

    set model(value: string) {
        if (this._model === value) {
            return;
        }

        this._model = value;
    }

    constructor(private _cdRef: ChangeDetectorRef) {
    }

    writeValue(obj: any): void {
        if (this.model === obj) {
            return;
        }

        this._model = obj;
    }

    registerOnChange(fn: any): void {
        this._onChanged = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (this.isDisabled === isDisabled) {
            return;
        }

        this.isDisabled = isDisabled;
    }

    onSliderChange(value: number): void {
        this._onChanged(value);
    }

    formatToValue(value: number): string {
        if(value < 61) {
            return Math.round(value).toString(10) + ' s';
        }

        let mins = Math.floor(value / 60);
        let secs = Math.round(value % 60).toString(10).padStart(2, '0');

        // sometimes the floating point calculation is not precise
        if(secs === '60') {
            mins++;
            secs = '00';
        }

        return `${mins}:${secs}`;
    }
}

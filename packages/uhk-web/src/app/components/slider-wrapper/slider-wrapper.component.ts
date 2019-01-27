import { AfterViewInit, Component, EventEmitter, forwardRef, Input, Output, OnDestroy, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NouisliderComponent } from 'ng2-nouislider';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface SliderPips {
    mode: string;
    values: number[];
    density: number;
    stepped?: boolean;
}

export interface SliderProps {
    min: number;
    max: number;
    step?: number;
    pips?: SliderPips;
    valueUnit?: string;
}

@Component({
    selector: 'slider-wrapper',
    templateUrl: './slider-wrapper.component.html',
    styleUrls: ['./slider-wrapper.component.scss'],
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SliderWrapperComponent), multi: true }]
})
export class SliderWrapperComponent implements AfterViewInit, ControlValueAccessor, OnDestroy {
    @ViewChild(NouisliderComponent) slider: NouisliderComponent;
    @Input() label: string;
    @Input() tooltip: string;
    @Input() min: number;
    @Input() max: number;
    @Input() step: number;
    @Input() pips: SliderPips;
    @Input() valueUnit: string;
    @Output() onChange = new EventEmitter<number>();

    public value: number;
    private changeObserver$: Observer<number>;
    private changeDebounceTime: number = 300;

    ngAfterViewInit(): void {
        if (this.pips) {
            this.slider.slider.pips(this.pips);
        }

        // Hide tooltips and show them when dragging slider handle
        this.slider.slider.target.querySelector('.noUi-tooltip').style.display = 'none';

        this.slider.slider.on('start', function() {
            this.target.querySelector('.noUi-tooltip').style.display = 'block';
        });
        this.slider.slider.on('end', function() {
            this.target.querySelector('.noUi-tooltip').style.display = 'none';
        });
    }

    ngOnDestroy() {
        if (this.changeObserver$) {
            this.changeObserver$.complete();
        }
    }

    writeValue(value: number): void {
        this.value = value || this.min;
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched() {}

    onSliderChange(value: number): void {
        if (!this.changeObserver$) {
            Observable.create(observer => {
                this.changeObserver$ = observer;
            })
                .pipe(
                    debounceTime(this.changeDebounceTime),
                    distinctUntilChanged()
                )
                .subscribe(this.propagateChange);

            return; // No change event on first change as the value is just being set
        }
        this.changeObserver$.next(value);
    }

    private propagateChange: any = () => {};
}

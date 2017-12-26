import { AfterViewInit, Component, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NouisliderComponent } from 'ng2-nouislider/src/nouislider';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { distinctUntilChanged } from 'rxjs/operator/distinctUntilChanged';

interface SliderPips {
    mode: string;
    values: number[];
    density: number;
    stepped?: boolean;
}

@Component({
    selector: 'slider-wrapper',
    templateUrl: './slider-wrapper.component.html',
    styleUrls: ['./slider-wrapper.component.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SliderWrapperComponent), multi: true }
    ]
})
export default class SliderWrapperComponent implements AfterViewInit, ControlValueAccessor {
    @ViewChild(NouisliderComponent) slider: NouisliderComponent;
    @Input() min: number;
    @Input() max: number;
    @Input() step: number;
    @Input() pips: SliderPips;
    @Output() onChange = new EventEmitter<number>();

    private value: number;
    private changeObserver$;
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
            }).debounceTime(this.changeDebounceTime)
            .distinctUntilChanged()
            .subscribe(this.propagateChange);
        }
        this.changeObserver$.next(value);
    }

    private propagateChange: any = () => {};
}

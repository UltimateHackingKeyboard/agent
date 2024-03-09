import { Component, EventEmitter, forwardRef, Input, Output, OnDestroy, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NouisliderComponent } from 'ng2-nouislider';
import { Observable, Observer } from 'rxjs';
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
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SliderWrapperComponent), multi: true }
    ]
})
export class SliderWrapperComponent implements ControlValueAccessor, OnDestroy {
    @ViewChild(NouisliderComponent, { static: false }) slider: NouisliderComponent;
    @Input() label: string;
    @Input() tooltip: string;
    @Input() min: number;
    @Input() max: number;
    @Input() step: number;
    @Input() pips: SliderPips;
    @Input() valueUnit: string;
    @Output() onChange = new EventEmitter<number>();

    public value: number;
    disabled = false;
    private changeObserver$: Observer<number>;
    private changeDebounceTime: number = 300;

    constructor(private sanitizer: DomSanitizer) {
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

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onSliderChange(value: number): void {
        if (!this.changeObserver$) {
            Observable.create(observer => {
                this.changeObserver$ = observer;
            }).pipe(
                debounceTime(this.changeDebounceTime),
                distinctUntilChanged()
            ).subscribe(this.propagateChange);

            return; // No change event on first change as the value is just being set
        }
        this.changeObserver$.next(value);
    }

    htmlTooltip(): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(this.tooltip);
    }

    private propagateChange: any = () => {};
}

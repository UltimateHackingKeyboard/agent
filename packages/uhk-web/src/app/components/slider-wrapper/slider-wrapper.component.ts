import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnDestroy,
    Output,
    ViewChild
} from '@angular/core';
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
    standalone: false,
    templateUrl: './slider-wrapper.component.html',
    styleUrls: ['./slider-wrapper.component.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SliderWrapperComponent), multi: true }
    ]
})
export class SliderWrapperComponent implements ControlValueAccessor, OnDestroy {
    @ViewChild(NouisliderComponent, { static: false }) slider: NouisliderComponent;
    @ViewChild('valueInput') valueInput: ElementRef<HTMLInputElement>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Input() config: any = {};
    @Input() label: string;
    @Input() tooltip: string;
    @Input() tooltipWidth: number;
    @Input() min: number;
    @Input() max: number;
    @Input() step: number;
    @Input() pips: SliderPips;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Input() range: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Input() tooltips: Array<any> = [true];
    @Input() valueFormatter: Function;
    @Input() valueUnit: string;
    @Output() onChange = new EventEmitter<number>();

    public value: number;
    disabled = false;
    editingValue = false;
    inputValue: string | number = '';
    private cancelPending = false;
    private changeObserver$: Observer<number>;
    private changeDebounceTime: number = 300;

    constructor(private sanitizer: DomSanitizer) {
    }

    ngOnDestroy() {
        if (this.changeObserver$) {
            this.changeObserver$.complete();
        }
    }

    get canEditValue(): boolean {
        return !this.disabled && !this.valueFormatter;
    }

    writeValue(value: number): void {
        this.value = value === undefined || value === null
            ? this.min
            : this.normalizeValue(value);
    }

    registerOnChange(fn: Function): void {
        this.propagateChange = fn;
    }

    registerOnTouched() {}

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    getFormatedValue(value: number): string {
        const normalized = this.normalizeValue(value);

        if (this.valueFormatter) {
            return this.valueFormatter(normalized);
        }

        if (this.valueUnit) {
            return normalized + ' ' + this.valueUnit;
        }

        return normalized.toString(10);
    }

    startEditing(): void {
        if (!this.canEditValue) {
            return;
        }

        this.cancelPending = false;
        this.inputValue = this.normalizeValue(this.value).toString(10);
        this.editingValue = true;

        setTimeout(() => {
            const input = this.valueInput?.nativeElement;
            if (input) {
                input.focus();
                input.select();
            }
        });
    }

    commitInputValue(): void {
        if (this.cancelPending) {
            this.cancelPending = false;
            this.editingValue = false;
            return;
        }

        if (!this.editingValue) {
            return;
        }

        const parsed = this.parseInputValue(this.inputValue);
        this.editingValue = false;

        if (parsed === null) {
            return;
        }

        const clamped = this.normalizeValue(Math.min(this.max, Math.max(this.min, parsed)));
        this.value = clamped;
        this.propagateValueChange(clamped);
    }

    cancelEditing(event?: KeyboardEvent): void {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        this.cancelPending = true;
        this.editingValue = false;
    }

    onSliderChange(value: number): void {
        this.propagateValueChange(value, true);
    }

    htmlTooltip(): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(this.tooltip);
    }

    private parseInputValue(raw: string | number | null | undefined): number | null {
        if (raw === null || raw === undefined) {
            return null;
        }

        if (typeof raw === 'number') {
            return Number.isFinite(raw) ? raw : null;
        }

        if (!raw.trim()) {
            return null;
        }

        let trimmed = raw.trim();
        if (this.valueUnit) {
            const suffix = ' ' + this.valueUnit;
            if (trimmed.endsWith(suffix)) {
                trimmed = trimmed.slice(0, -suffix.length).trim();
            }
        }

        const parsed = Number(trimmed);
        return Number.isFinite(parsed) ? parsed : null;
    }

    private getStepDecimalPlaces(): number {
        if (!this.step || this.step <= 0) {
            return 0;
        }

        const stepString = this.step.toString();
        const decimalIndex = stepString.indexOf('.');
        if (decimalIndex === -1) {
            return 0;
        }

        return stepString.length - decimalIndex - 1;
    }

    private normalizeValue(value: number): number {
        const stepDecimals = this.getStepDecimalPlaces();
        const fractionDigits = Math.min(Math.max(stepDecimals + 2, 6), 10);
        return Number(value.toFixed(fractionDigits));
    }

    private propagateValueChange(value: number, skipFirstChange = false): void {
        if (!this.changeObserver$) {
            Observable.create(observer => {
                this.changeObserver$ = observer;
            }).pipe(
                debounceTime(this.changeDebounceTime),
                distinctUntilChanged()
            ).subscribe(this.propagateChange);

            if (skipFirstChange) {
                return;
            }
        }

        this.changeObserver$.next(value);
    }

    private propagateChange: Function = () => {};
}

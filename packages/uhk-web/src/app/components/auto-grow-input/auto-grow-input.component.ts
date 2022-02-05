import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    forwardRef, HostListener,
    Input,
    OnChanges,
    Renderer2,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as util from '../../util';

const noop = (_: any) => {
};

@Component({
    selector: 'auto-grow-input',
    templateUrl: './auto-grow-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AutoGrowInputComponent),
            multi: true
        }
    ],
    styleUrls: ['./auto-grow-input.component.scss']
})
export class AutoGrowInputComponent implements ControlValueAccessor, AfterViewInit, OnChanges {
    @Input() maxParentWidthPercent;
    @Input() maxParentWidthOffset;
    @Input() minWidth: number = 100;
    @Input() css: string;
    @Input() selectAfterInit = false;

    @ViewChild('inputControl', { static: true }) inputControl: ElementRef<HTMLInputElement>;

    disabled: boolean;

    get model(): string {
        return this._model;
    }

    set model(value: string) {
        if (this._model === value) {
            return;
        }

        this._model = value;
    }

    private _model: string;
    private _originalModel: string;
    private _onChanged = noop;
    private _onTouched = noop;
    private _inEditMode = false;

    constructor(private _cdRef: ChangeDetectorRef,
                private _renderer: Renderer2) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.selectAfterInit.currentValue) {
            this.selectContent();
        }
    }

    ngAfterViewInit(): void {
        this.selectContent();
    }

    selectContent(): void {
        if (this.selectAfterInit && this.inputControl) {
            setTimeout(() => {
                this.inputControl.nativeElement.select();
                this.selectAfterInit = false;
            });
        }
    }

    registerOnChange(fn: any): void {
        this._onChanged = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        if (this.disabled === isDisabled) {
            return;
        }

        this.disabled = isDisabled;
        this._cdRef.markForCheck();
    }

    @HostListener('window:resize')
    windowResize(): void {
        this.calculateTextWidth(this._model);
    }

    writeValue(obj: any): void {
        if (this.model === obj) {
            return;
        }

        this._model = obj;
        this._originalModel = obj;
        this.calculateTextWidth(this._model);
        this._cdRef.markForCheck();
    }

    focus(): void {
        setTimeout(() => {
            this.inputControl.nativeElement.focus();
        });
    }

    inputFocus(): void {
        this._inEditMode = true;
        this.calculateTextWidth(this.model);
        this._onTouched(this);
    }

    blur(): void {
        this._inEditMode = false;
        if (!util.isValidName(this._model) || this._model.trim() === this._originalModel) {
            this._model = this._originalModel;
            this.calculateTextWidth(this._model);
            this._cdRef.markForCheck();
            return;
        }

        this._originalModel = this._model;
        this.calculateTextWidth(this._model);
        this._onChanged(this._model);
    }

    keyEnter(event): void {
        event.target.blur();
    }

    calculateTextWidth(text: string): void {
        const htmlInput = this.inputControl.nativeElement as HTMLInputElement;
        let maxWidth = htmlInput.parentElement.parentElement.offsetWidth;

        if (this.maxParentWidthPercent) {
            maxWidth *= this.maxParentWidthPercent;
        } else if (this.maxParentWidthOffset) {
            maxWidth -= this.maxParentWidthOffset;
        }
        maxWidth = Math.max(this.minWidth, maxWidth); // Clamp to ensure usable width

        let textWidth = util.getContentWidth(window.getComputedStyle(htmlInput), text) * 1.01;

        if (this._inEditMode) {
            textWidth += util.getContentWidth(window.getComputedStyle(htmlInput), 'W') * 1.1;
        }

        this._renderer.setStyle(htmlInput, 'width', Math.min(maxWidth, textWidth) + 'px');
    }
}

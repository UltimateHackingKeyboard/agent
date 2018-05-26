import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    forwardRef, HostListener,
    Input,
    Renderer2,
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
    ]
})
export class AutoGrowInputComponent implements ControlValueAccessor {
    @Input() maxParentWidthPercent = 1;
    @Input() css: string;

    @ViewChild('inputControl') inputControl: ElementRef;

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

    constructor(private _cdRef: ChangeDetectorRef,
                private _renderer: Renderer2) {
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
        console.log('write', new Date());
        if (this.model === obj) {
            return;
        }

        this._model = obj;
        this._originalModel = obj;
        this.calculateTextWidth(this._model);
        this._cdRef.markForCheck();
    }

    focus(): void {
        this._onTouched(this);
    }

    blur(): void {
        if (!util.isValidName(this._model) || this._model.trim() === this._originalModel) {
            this._model = this._originalModel;
            this.calculateTextWidth(this._model);
            this._cdRef.markForCheck();
            return;
        }

        this._onChanged(this._model);
    }

    keyEnter(event): void {
        event.target.blur();
    }

    calculateTextWidth(text: string): void {
        const htmlInput = this.inputControl.nativeElement as HTMLInputElement;
        const maxWidth = htmlInput.parentElement.parentElement.offsetWidth * this.maxParentWidthPercent;
        const textWidth = util.getContentWidth(window.getComputedStyle(htmlInput), text);
        this._renderer.setStyle(htmlInput, 'width', Math.min(maxWidth, textWidth) + 'px');
    }
}

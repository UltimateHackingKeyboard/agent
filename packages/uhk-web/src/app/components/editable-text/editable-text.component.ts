import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'editable-text',
    templateUrl: './editable-text.component.html',
    styleUrls: ['./editable-text.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => EditableTextComponent), multi: true}
    ]
})
export class EditableTextComponent implements ControlValueAccessor {

    @Input() placeholder = 'No editable content';
    text: string;
    originalText: string;
    editing = false;

    get isSaveDisabled(): boolean {
        return !this.text || this.text.trim().length === 0;
    }

    get displayText(): string {
        return this.text && this.text.replace(/\n/g, '<br>');
    }

    constructor(private cdr: ChangeDetectorRef) {

    }

    writeValue(obj: any): void {
        if (this.text === obj) {
            return;
        }

        this.text = obj;
        this.cdr.markForCheck();
    }

    registerOnChange(fn: any): void {
        this.textChange = fn;
    }

    registerOnTouched(fn: any): void {
    }

    saveText(): void {
        this.originalText = null;
        this.editing = false;
        this.textChange(this.text);
    }

    editText(): void {
        this.originalText = this.text;
        this.editing = true;
    }

    cancelEditText(): void {
        this.text = this.originalText;
        this.editing = false;
    }

    keydownEnter(): void {
        if (this.isSaveDisabled) {
            return;
        }

        this.saveText();
    }

    get showPlaceholder(): boolean {
        return !this.editing && !this.text;
    }

    get showText(): boolean {
        return !this.editing && !!this.text;
    }

    private textChange: any = () => {
    }
}

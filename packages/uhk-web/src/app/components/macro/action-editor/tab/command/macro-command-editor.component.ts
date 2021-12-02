import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    forwardRef,
    HostListener,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const NON_ASCII_REGEXP = /[^\x00-\x7F]/g;

@Component({
    selector: 'macro-command-editor',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './macro-command-editor.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MacroCommandEditorComponent),
        multi: true
    }],
    styleUrls: ['./macro-command-editor.component.scss']
})
export class MacroCommandEditorComponent implements AfterViewInit, ControlValueAccessor {
    value: string;
    disabled: boolean;

    editorOptions = {
        theme: 'vs-dark',
        scrollBeyondLastLine: false,
        minimap: {
            enabled: false
        },
        folding: 0,
        glyphMargin: false,
        lineNumbers: false,
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 0
    }

    editor: any

    constructor(private cdRef: ChangeDetectorRef) {
    }

    ngAfterViewInit(): void {
        if(this.editor) {
            this.editor.focus()
        }
    }

    private onChanged = (_: any) => {};
    private onTouched = () => {};

    @HostListener('paste', [])
    onPaste(): void {
        if (!this.editor) {
            return;
        }

        const cursorPosition = this.editor.getPosition();
        const value = this.editor.getValue().replace(NON_ASCII_REGEXP, '');
        this.editor.setValue(value);
        this.editor.setPosition(cursorPosition);
    }

    onEditorInit(editor: any) {
        this.editor = editor;
        editor.onKeyDown((event: KeyboardEvent) => {
            if (new RegExp(NON_ASCII_REGEXP).test(event.key)) {
                event.preventDefault();
                event.stopPropagation();
            }
        })

        editor.onDidBlurEditorText(() => this.onTouched())
    }

    onValueChanged(value: string): void {
        this.value = value;
        this.onChanged(this.value);
    }

    registerOnChange(fn: any): void {
        this.onChanged = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
        this.cdRef.detectChanges();
    }

    writeValue(obj: string): void {
        if (this.value === obj) {
            return;
        }

        this.value = obj;
        this.cdRef.detectChanges();
    }
}

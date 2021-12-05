import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    forwardRef,
    HostListener,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MonacoEditorConstructionOptions } from '@materia-ui/ngx-monaco-editor';

const NON_ASCII_REGEXP = /[^\x00-\x7F]/g;
// 1.3 ratio is the different between the 2 agent and monaco-editor font size
const FONT_SIZE_RATIO = 1.3;

function getVsCodeTheme(): string {
    return (window as any).getUhkTheme() === 'dark' ? 'vs-dark' : 'vs';
}

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
export class MacroCommandEditorComponent implements AfterViewInit, ControlValueAccessor, OnChanges {
    /**
     * Show the macro edit as high as possible
     */
    @Input() fullHeight = false;

    value: string;
    disabled: boolean;

    editorOptions: MonacoEditorConstructionOptions = {
        theme: getVsCodeTheme(),
        scrollBeyondLastLine: false,
        minimap: {
            enabled: false
        },
        folding: false,
        glyphMargin: false,
        lineNumbers: 'off',
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 0
    };

    editor: any;
    containerHeight = '3em';

    constructor(private cdRef: ChangeDetectorRef) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.fullHeight) {
            this.calculateHeight();
        }
    }

    ngAfterViewInit(): void {
        if (this.editor) {
            this.editor.focus();
        }
        this.calculateHeight();
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
        });

        editor.onDidBlurEditorText(() => this.onTouched());
    }

    onValueChanged(value: string): void {
        this.value = value;
        this.calculateHeight();
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
        this.calculateHeight();
        this.cdRef.detectChanges();
    }

    private calculateHeight() {
        if (!this.fullHeight) {
            return;
        }

        const value = this.value || '';
        let lines = value.split('\n').length;

        if (lines < 1) {
           lines = 1;
        }

        lines = lines * FONT_SIZE_RATIO;
        const newHeight = `${lines}em`;
        if (this.containerHeight === newHeight) {
            return;
        }

        this.containerHeight = newHeight;
        this.cdRef.detectChanges();
    }
}

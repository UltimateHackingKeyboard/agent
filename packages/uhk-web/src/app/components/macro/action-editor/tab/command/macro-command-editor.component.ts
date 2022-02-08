import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    forwardRef,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MonacoEditorConstructionOptions, MonacoStandaloneCodeEditor } from '@materia-ui/ngx-monaco-editor';
import { Observable, Observer, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { SelectedMacroActionId } from '../../../../../models';
import { SmartMacroDocService } from '../../../../../services/smart-macro-doc-service';

const NON_ASCII_REGEXP = /[^\x00-\x7F]/g;
const MONACO_EDITOR_LINE_HEIGHT_OPTION = 58;
const MACRO_CHANGE_DEBOUNCE_TIME = 250;

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
export class MacroCommandEditorComponent implements AfterViewInit, ControlValueAccessor, OnChanges, OnDestroy, OnInit {
    /**
     * Show the macro edit as high as possible
     */
    @Input() fullHeight = false;
    @Input() autoFocus = false;
    @Input() index: SelectedMacroActionId;

    @Output() gotFocus = new EventEmitter<void>();

    value: string = null;

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
        lineNumbersMinChars: 0,
        renderLineHighlight: 'none',
        scrollbar: {
            alwaysConsumeMouseWheel: false
        }
    };

    editor: MonacoStandaloneCodeEditor;
    containerHeight = '54px';

    private lineHeight = 18;
    private isFocused = false;
    private insertingMacro = false;
    private changeObserver$: Observer<string>;
    private subscriptions = new Subscription();

    constructor(private cdRef: ChangeDetectorRef,
                private smartMacroDocService: SmartMacroDocService) {
    }

    ngOnInit(): void {
        this.subscriptions.add(
            this.smartMacroDocService
                .insertMacroCommand
                .subscribe(command => {
                    if(!this.editor) {
                        return;
                    }

                    if (command.macroActionId !== this.index) {
                        return;
                    }

                    const selection = this.editor.getSelection();
                    const operation = {
                        range: selection,
                        text: command.data,
                        forceMoveMarkers: true
                    };
                    this.insertingMacro = true;
                    this.editor.executeEdits("my-source", [operation]);
                })
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.fullHeight) {
            this.calculateHeight();
        }
    }

    ngAfterViewInit(): void {
        if (this.editor && this.autoFocus) {
            this.editor.focus();
        }
        this.calculateHeight();
    }

    ngOnDestroy() {
        if (this.changeObserver$) {
            this.changeObserver$.complete();
        }
        this.subscriptions.unsubscribe();
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

    onEditorInit(editor: MonacoStandaloneCodeEditor) {
        this.editor = editor;
        editor.onKeyDown((event) => {
            if (new RegExp(NON_ASCII_REGEXP).test(event.code)) {
                event.preventDefault();
                event.stopPropagation();
            }
        });

        editor.onDidBlurEditorText(() => {
            this.isFocused = false;
            if (this.editorOptions.readOnly) {
                return;
            }

            this.onTouched();
        });

        editor.onDidFocusEditorText(()=> {
            this.isFocused = true;
            this.gotFocus.emit();
        });

        this.lineHeight = this.editor.getOption(MONACO_EDITOR_LINE_HEIGHT_OPTION);
        this.calculateHeight();
    }

    onValueChanged(value: string): void {
        if (!this.isFocused && !this.insertingMacro) {
            return;
        }

        this.insertingMacro = false;
        this.value = value;
        this.calculateHeight();

        if (!this.changeObserver$) {
            Observable.create(observer => {
                this.changeObserver$ = observer;
            }).pipe(
                debounceTime(MACRO_CHANGE_DEBOUNCE_TIME),
                distinctUntilChanged()
            ).subscribe(this.onChanged);
        }
        this.changeObserver$.next(value);
    }

    registerOnChange(fn: any): void {
        this.onChanged = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean) {
        this.editorOptions.readOnly = isDisabled;
        if (this.editor) {
            this.editor.updateOptions({
                readOnly: isDisabled,
                domReadOnly: isDisabled
            });
        }
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

    private calculateHeight(): void {
        if (!this.fullHeight) {
            return;
        }

        const value = this.value || '';
        let lines = value.split('\n').length;

        if (lines < 3) {
            lines = 3;
        }

        // 6 is the padding and border width
        const newHeight = `${(lines * this.lineHeight) + 6}px`;
        if (this.containerHeight === newHeight) {
            return;
        }

        this.containerHeight = newHeight;
        this.cdRef.detectChanges();
    }
}

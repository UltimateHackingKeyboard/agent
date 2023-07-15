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
import { Key } from 'ts-keycode-enum';

import { SelectedMacroActionId } from '../../../../../models';
import { SmartMacroDocCommandAction, SmartMacroDocService } from '../../../../../services/smart-macro-doc-service';
import { hasNonAsciiCharacters, NON_ASCII_REGEXP } from '../../../../../util';

const MONACO_EDITOR_LINE_HEIGHT_OPTION = 59;
const MONACO_EDITOR_LF_END_OF_LINE_OPTION = 0;
const MACRO_CHANGE_DEBOUNCE_TIME = 250;

function getVsCodeTheme(): string {
    return (window as any).getUhkTheme() === 'dark' ? 'uhk-dark' : 'vs';
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

    @Output() ctrlEnterKeyDown = new EventEmitter<void>();
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
            alwaysConsumeMouseWheel: false,
            useShadows: false
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
                .smartMacroDocCommand
                .subscribe(command => {
                    if(!this.editor) {
                        return;
                    }

                    if (command.macroActionId !== this.index) {
                        return;
                    }

                    switch (command.action) {
                        case SmartMacroDocCommandAction.insert:
                            return this.insertMacroCommand(command.data);

                        case SmartMacroDocCommandAction.set:
                            return this.setMacroCommand(command.data);
                    }

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

        this.removeNonAsciiCharachters();
    }

    onEditorInit(editor: MonacoStandaloneCodeEditor) {
        this.editor = editor;
        this.setLFEndOfLineOption();
        if (this.autoFocus) {
            this.editor.focus();
            this.isFocused = true;
        }
        editor.onKeyDown((event) => {
            if(event.browserEvent.ctrlKey && event.browserEvent.keyCode === Key.Enter) {
                event.preventDefault();
                event.stopPropagation();
                this.ctrlEnterKeyDown.emit();

                return;
            }

            if (hasNonAsciiCharacters(event.browserEvent.key)) {
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
            // To be sure the macro command doc got the latest edited macro command
            this.smartMacroDocService.updateCommand(this.value);
        });

        this.lineHeight = this.editor.getOption(MONACO_EDITOR_LINE_HEIGHT_OPTION) as any;
        this.calculateHeight();
    }

    onValueChanged(value: string): void {
        if (!this.isFocused && !this.insertingMacro) {
            return;
        }

        if (hasNonAsciiCharacters(value)) {
            this.removeNonAsciiCharachters();
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
            ).subscribe(data => {
                // If the user modify the macro without saving then we update the macro text
                if (this.isFocused) {
                    this.smartMacroDocService.updateCommand(data);
                }
                this.onChanged(data);
            });
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

    /**
     * Insert macro command to the monaco editor
     * Logic
     * - if text selected in the editor then replace the text
     * - if text not selected in the editor then
     *   - cursor at the beginning of the line => insert macro and line break. The current line moves to the next line
     *   - cursor at the end of the line => insert the macro into new line
     *   - cursor at the middle of the line => insert the macro into new line
     * @param data
     * @private
     */
    private insertMacroCommand(data: string): void {
        data = data?.trim();

        let selection = this.editor.getSelection();
        let cursorPosition;
        if (selection.isEmpty()) {
            const macroLines = this.editor.getValue().split(this.editor.getModel().getEOL());
            const lineNumber = selection.getPosition().lineNumber;
            const column = selection.getPosition().column;
            const line = macroLines[lineNumber - 1];
            if (column === 1) {
                if (line.length !== 0) {
                    data += this.editor.getModel().getEOL();
                }
            } else if (column === line.length) {
                data = this.editor.getModel().getEOL() + data;
            } else {
                data = this.editor.getModel().getEOL() + data;
                selection = selection
                    .setEndPosition(lineNumber, line.length + 1)
                    .setStartPosition(lineNumber, line.length + 1);
                cursorPosition = { lineNumber: lineNumber + 1, column: data.length };
            }
        }
        const operation = {
            range: selection,
            id: { major: 1, minor: 1 },
            text: data,
            forceMoveMarkers: true
        };
        this.insertingMacro = true;
        this.editor.executeEdits("my-source", [operation]);
        if (cursorPosition) {
            this.editor.setPosition(cursorPosition);
        }
    }

    private removeNonAsciiCharachters() {
        const cursorPosition = this.editor.getPosition();
        const value = this.editor.getValue().replace(NON_ASCII_REGEXP, '');
        this.editor.setValue(value);
        this.editor.setPosition(cursorPosition);
    }

    private setMacroCommand(data: string): void {
        this.insertingMacro = true;
        this.writeValue(data?.trim());
    }

    private setLFEndOfLineOption(): void {
        if (!this.editor) {
            return;
        }

        // setTimeout needed because otherwise the editor not recognize the new EOL option
        // when the editor first created. So if macro command has CRLF and the user modify the macro command
        // then the editor keep the CRLF option and not the LF option
        setTimeout(() => {
            this.editor.getModel().setEOL(MONACO_EDITOR_LF_END_OF_LINE_OPTION);
        }, 1);
    }
}

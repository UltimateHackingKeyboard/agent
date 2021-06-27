import {
    OnInit,
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    ViewChild
} from '@angular/core';
import { CommandMacroAction } from 'uhk-common';

import { MacroBaseComponent } from '../macro-base.component';

const NON_ASCII_REGEXP = /[^\x00-\x7F]/g;

@Component({
    selector: 'macro-command-tab',
    templateUrl: './macro-command.component.html',
    styleUrls: ['./macro-command.component.scss'],
    host: { 'class': 'macro__text' }
})
export class MacroCommandComponent extends MacroBaseComponent implements OnInit, AfterViewInit {
    @Input() macroAction: CommandMacroAction;
    @ViewChild('macroTextInput', { static: false } ) input: ElementRef;

    constructor() { super(); }

    ngOnInit() {
        this.init();
    }

    ngAfterViewInit() {
        this.input.nativeElement.focus();
    }

    onTextChange() {
        this.init();
        this.macroAction.command = this.input.nativeElement.value;
    }

    /**
     * Not allow non ascii character
     * @param $event
     */
    onKeydown($event: KeyboardEvent): void {
        if (new RegExp(NON_ASCII_REGEXP).test($event.key)) {
            $event.preventDefault();
            $event.stopPropagation();
        }
    }

    /**
     * Remove non ascii character from clipboard data
     * @param $event
     */
    onPaste($event: ClipboardEvent): void {
        $event.preventDefault();

        const textarea: HTMLTextAreaElement = this.input.nativeElement;
        const data = $event.clipboardData.getData('text/plain');
        const text = data && data.replace(NON_ASCII_REGEXP, '') || '';
        if (text.length === 0) {
            return;
        }

        const value = textarea.value || '';
        const prefix = value.substr(0, textarea.selectionStart);
        const end = textarea.selectionEnd;
        const suffix = value.substr(textarea.selectionEnd);
        textarea.value = prefix + text + suffix;
        const correction = end === 0 ? 0 : 1;
        textarea.selectionStart = textarea.selectionEnd = end + text.length - correction;
        this.macroAction.command = textarea.value;
    }

    isMacroValid = () => !!this.input.nativeElement.value;

    private init = () => {
        if (!this.macroAction) {
            this.macroAction = new CommandMacroAction();
        }
    }

}

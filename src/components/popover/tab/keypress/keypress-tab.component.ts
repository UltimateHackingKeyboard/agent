import { Component, Input, EventEmitter, OnChanges, Output } from '@angular/core';

import { Select2OptionData, Select2TemplateFunction } from 'ng2-select2';

import { KeyAction, KeystrokeAction } from '../../../../config-serializer/config-items/key-action';

import { Tab } from '../tab';
import { MapperService } from '../../../../services/mapper.service';

@Component({
    selector: 'keypress-tab',
    template: require('./keypress-tab.component.html'),
    styles: [require('./keypress-tab.component.scss')]
})
export class KeypressTabComponent implements OnChanges, Tab {
    @Input() defaultKeyAction: KeyAction;
    @Input() longPressEnabled: boolean;

    @Output() validAction = new EventEmitter();

    private leftModifiers: string[];
    private rightModifiers: string[];

    private leftModifierSelects: boolean[];
    private rightModifierSelects: boolean[];

    private scanCodeGroups: Array<Select2OptionData>;
    private longPressGroups: Array<Select2OptionData>;
    private options: Select2Options;

    private scanCode: number;
    private selectedLongPressIndex: number;

    constructor(private mapper: MapperService) {
        this.leftModifiers = ['LShift', 'LCtrl', 'LSuper', 'LAlt'];
        this.rightModifiers = ['RShift', 'RCtrl', 'RSuper', 'RAlt'];
        this.scanCodeGroups = [{
            id: '0',
            text: 'None'
        }];
        this.scanCodeGroups = this.scanCodeGroups.concat(require('json!./scancodes.json'));
        this.longPressGroups = require('json!./longPress.json');
        this.leftModifierSelects = Array(this.leftModifiers.length).fill(false);
        this.rightModifierSelects = Array(this.rightModifiers.length).fill(false);
        this.scanCode = 0;
        this.selectedLongPressIndex = -1;
        this.options = {
            templateResult: this.scanCodeTemplateResult,
            matcher: (term: string, text: string, data: Select2OptionData) => {
                let found = text.toUpperCase().indexOf(term.toUpperCase()) > -1;

                if (!found && data.additional && data.additional.explanation) {
                    found = data.additional.explanation.toUpperCase().indexOf(term.toUpperCase()) > -1;
                }

                return found;
            }
        };
    }

    ngOnChanges() {
        this.fromKeyAction(this.defaultKeyAction);
        this.validAction.emit(this.keyActionValid());
    }

    keyActionValid(keystrokeAction?: KeystrokeAction): boolean {
        if (!keystrokeAction) {
            keystrokeAction = this.toKeyAction();
        }

        return (keystrokeAction) ? (keystrokeAction.scancode > 0 || keystrokeAction.modifierMask > 0) : false;
    }

    onKeysCapture(event: {code: number, left: boolean[], right: boolean[]}) {
        if (event.code) {
            this.scanCode = event.code;
        } else {
            this.scanCode = 0;
        }

        this.leftModifierSelects = event.left;
        this.rightModifierSelects = event.right;
        this.validAction.emit(this.keyActionValid());
    }

    fromKeyAction(keyAction: KeyAction): boolean {
        if (!(keyAction instanceof KeystrokeAction)) {
            return false;
        }
        let keystrokeAction: KeystrokeAction = <KeystrokeAction>keyAction;
        // Restore scancode
        this.scanCode = keystrokeAction.scancode || 0;

        let leftModifiersLength: number = this.leftModifiers.length;

        // Restore modifiers
        for (let i = 0; i < leftModifiersLength; ++i) {
            this.leftModifierSelects[this.mapper.modifierMapper(i)] = ((keystrokeAction.modifierMask >> i) & 1) === 1;
        }

        for (let i = leftModifiersLength; i < leftModifiersLength + this.rightModifierSelects.length; ++i) {
            let index: number = this.mapper.modifierMapper(i) - leftModifiersLength;
            this.rightModifierSelects[index] = ((keystrokeAction.modifierMask >> i) & 1) === 1;
        }

        // Restore longPressAction
        if (keystrokeAction.longPressAction !== undefined) {
            this.selectedLongPressIndex = this.mapper.modifierMapper(keystrokeAction.longPressAction);
        }

        return true;
    }

    toKeyAction(): KeystrokeAction {
        let keystrokeAction: KeystrokeAction = new KeystrokeAction();
        keystrokeAction.scancode = this.scanCode;

        keystrokeAction.modifierMask = 0;
        let modifiers = this.leftModifierSelects.concat(this.rightModifierSelects).map(x => x ? 1 : 0);
        for (let i = 0; i < modifiers.length; ++i) {
            keystrokeAction.modifierMask |= modifiers[i] << this.mapper.modifierMapper(i);
        }

        keystrokeAction.longPressAction = this.selectedLongPressIndex === -1
            ? undefined
            : this.mapper.modifierMapper(this.selectedLongPressIndex);

        if (this.keyActionValid(keystrokeAction)) {
            return keystrokeAction;
        }
    }

    scanCodeTemplateResult: Select2TemplateFunction = (state: Select2OptionData): JQuery | string => {
        if (!state.id) {
            return state.text;
        }

        if (state.additional && state.additional.explanation) {
            return jQuery(
                '<span class="select2-item">'
                    + '<span>' + state.text + '</span>'
                    + '<span class="scancode--searchterm"> '
                    + state.additional.explanation
                    + '</span>' +
                '</span>'
            );
        } else {
            return jQuery('<span class="select2-item">' + state.text + '</span>');
        }
    }

    toggleModifier(right: boolean, index: number) {
        let modifierSelects: boolean[] = right ? this.rightModifierSelects : this.leftModifierSelects;
        modifierSelects[index] = !modifierSelects[index];

        this.validAction.emit(this.keyActionValid());
    }

    onLongpressChange(event: {value: string}) {
        this.selectedLongPressIndex = +event.value;
    }

    onScancodeChange(event: {value: string}) {
        this.scanCode = +event.value;
        this.validAction.emit(this.keyActionValid());
    }
}

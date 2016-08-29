import { Component, Input, OnChanges } from '@angular/core';

import { Select2OptionData } from 'ng2-select2/ng2-select2';

import { KeyAction, KeystrokeAction } from '../../../../config-serializer/config-items/key-action';

import { Tab } from '../tab';

@Component({
    selector: 'keypress-tab',
    template: require('./keypress-tab.component.html'),
    styles: [require('./keypress-tab.component.scss')]
})
export class KeypressTabComponent implements OnChanges, Tab {
    @Input() defaultKeyAction: KeyAction;
    @Input() longPressEnabled: boolean;

    private leftModifiers: string[];
    private rightModifiers: string[];

    private leftModifierSelects: boolean[];
    private rightModifierSelects: boolean[];

    private scanCodeGroups: Array<Select2OptionData>;
    private longPressGroups: Array<Select2OptionData>;

    private scanCode: number;
    private selectedLongPressIndex: number;

    constructor() {
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
    }

    ngOnChanges() {
        this.fromKeyAction(this.defaultKeyAction);
    }

    keyActionValid(keystrokeAction?: KeystrokeAction): boolean {
        if (!keystrokeAction) {
            keystrokeAction = this.toKeyAction();
        }
        return keystrokeAction.scancode > 0 || keystrokeAction.modifierMask > 0;
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
            this.leftModifierSelects[this.modifierMapper(i)] = ((keystrokeAction.modifierMask >> i) & 1) === 1;
        }

        for (let i = leftModifiersLength; i < leftModifiersLength + this.rightModifierSelects.length; ++i) {
            let index: number = this.modifierMapper(i) - leftModifiersLength;
            this.rightModifierSelects[index] = ((keystrokeAction.modifierMask >> i) & 1) === 1;
        }

        // Restore longPressAction
        if (keystrokeAction.longPressAction !== undefined) {
            this.selectedLongPressIndex = this.modifierMapper(keystrokeAction.longPressAction);
        }

        return true;
    }

    toKeyAction(): KeystrokeAction {
        let keystrokeAction: KeystrokeAction = new KeystrokeAction();
        keystrokeAction.scancode = this.scanCode;

        keystrokeAction.modifierMask = 0;
        let modifiers = this.leftModifierSelects.concat(this.rightModifierSelects).map(x => x ? 1 : 0);
        for (let i = 0; i < modifiers.length; ++i) {
            keystrokeAction.modifierMask |= modifiers[i] << this.modifierMapper(i);
        }

        keystrokeAction.longPressAction = this.selectedLongPressIndex === -1
            ? undefined
            : this.modifierMapper(this.selectedLongPressIndex);

        if (!this.keyActionValid(keystrokeAction)) {
            throw new Error('KeyAction is invalid!');
        }

        return keystrokeAction;
    }

    scanCodeTemplateResult: Function = (state: any) => {
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
    }

    // TODO: change to the correct type when the wrapper has added it.
    /* tslint:disable:no-unused-variable: It is used in the template. */
    private onLongpressChange(event: any) {
        /* tslint:enable:no-unused-variable: */
        this.selectedLongPressIndex = +event.value;
    }

    // TODO: change to the correct type when the wrapper has added it.
    /* tslint:disable:no-unused-variable: It is used in the template. */
    private onScancodeChange(event: any) {
        /* tslint:enable:no-unused-variable */
        this.scanCode = +event.value;
    }

    private modifierMapper(x: number) {
        if (x < 8) {
            return Math.floor(x / 2) * 4 + 1 - x; // 1, 0, 3, 2, 5, 4, 7, 6
        } else {
            return x;
        }
    };
}

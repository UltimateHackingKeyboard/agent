import { Component, Input, OnChanges } from '@angular/core';

import { Select2OptionData, Select2TemplateFunction } from 'ng2-select2';

import { KeyAction, KeystrokeAction } from '../../../../config-serializer/config-items/key-action';

import { Tab } from '../tab';
import { MapperService } from '../../../../services/mapper.service';
import { KeystrokeType } from '../../../../config-serializer/config-items/key-action/keystroke-type';

@Component({
    selector: 'keypress-tab',
    templateUrl: './keypress-tab.component.html',
    styleUrls: ['./keypress-tab.component.scss']
})
export class KeypressTabComponent extends Tab implements OnChanges {
    @Input() defaultKeyAction: KeyAction;
    @Input() longPressEnabled: boolean;

    leftModifiers: string[];
    rightModifiers: string[];

    leftModifierSelects: boolean[];
    rightModifierSelects: boolean[];

    scanCodeGroups: Array<Select2OptionData>;
    longPressGroups: Array<Select2OptionData>;
    options: Select2Options;

    selectedScancodeOption: Select2OptionData;
    selectedLongPressIndex: number;

    constructor(private mapper: MapperService) {
        super();
        this.leftModifiers = ['LShift', 'LCtrl', 'LSuper', 'LAlt'];
        this.rightModifiers = ['RShift', 'RCtrl', 'RSuper', 'RAlt'];
        this.scanCodeGroups = [{
            id: '0',
            text: 'None'
        }];
        this.scanCodeGroups = this.scanCodeGroups.concat(require('json-loader!./scancodes.json'));
        this.longPressGroups = require('json-loader!./longPress.json');
        this.leftModifierSelects = Array(this.leftModifiers.length).fill(false);
        this.rightModifierSelects = Array(this.rightModifiers.length).fill(false);
        this.selectedScancodeOption = this.scanCodeGroups[0];
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

    onKeysCapture(event: { code: number, left: boolean[], right: boolean[] }) {
        if (event.code) {
            this.selectedScancodeOption = this.findScancodeOptionByScancode(event.code, KeystrokeType.basic);
        } else {
            this.selectedScancodeOption = this.scanCodeGroups[0];
        }

        this.leftModifierSelects = event.left;
        this.rightModifierSelects = event.right;
        this.validAction.emit(this.keyActionValid());
    }

    fromKeyAction(keyAction: KeyAction): boolean {
        if (!(keyAction instanceof KeystrokeAction)) {
            return false;
        }
        const keystrokeAction: KeystrokeAction = <KeystrokeAction>keyAction;
        // Restore selectedScancodeOption
        this.selectedScancodeOption = this.findScancodeOptionByScancode(keystrokeAction.scancode || 0, keystrokeAction.type);

        const leftModifiersLength: number = this.leftModifiers.length;

        // Restore modifiers
        for (let i = 0; i < leftModifiersLength; ++i) {
            this.leftModifierSelects[this.mapper.modifierMapper(i)] = ((keystrokeAction.modifierMask >> i) & 1) === 1;
        }

        for (let i = leftModifiersLength; i < leftModifiersLength + this.rightModifierSelects.length; ++i) {
            const index: number = this.mapper.modifierMapper(i) - leftModifiersLength;
            this.rightModifierSelects[index] = ((keystrokeAction.modifierMask >> i) & 1) === 1;
        }

        // Restore longPressAction
        if (keystrokeAction.longPressAction !== undefined) {
            this.selectedLongPressIndex = this.mapper.modifierMapper(keystrokeAction.longPressAction);
        }

        return true;
    }

    toKeyAction(): KeystrokeAction {
        const keystrokeAction: KeystrokeAction = new KeystrokeAction();
        const scTypePair = this.toScancodeTypePair(this.selectedScancodeOption);
        keystrokeAction.scancode = scTypePair[0];
        if (scTypePair[1] === 'media') {
            keystrokeAction.type = KeystrokeType.shortMedia;
        } else {
            keystrokeAction.type = KeystrokeType[scTypePair[1]];
        }
        keystrokeAction.modifierMask = 0;
        const modifiers = this.leftModifierSelects.concat(this.rightModifierSelects).map(x => x ? 1 : 0);
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
        const modifierSelects: boolean[] = right ? this.rightModifierSelects : this.leftModifierSelects;
        modifierSelects[index] = !modifierSelects[index];

        this.validAction.emit(this.keyActionValid());
    }

    onLongpressChange(event: { value: string }) {
        this.selectedLongPressIndex = +event.value;
    }

    onScancodeChange(event: { value: string }) {
        const id: string = event.value;

        // ng2-select2 should provide the selectedOption in an upcoming release
        // TODO: change this when it has become available
        this.selectedScancodeOption = this.findScancodeOptionById(id);

        this.validAction.emit(this.keyActionValid());
    }

    private findScancodeOptionBy(predicate: (option: Select2OptionData) => boolean): Select2OptionData {
        let selectedOption: Select2OptionData;

        const scanCodeGroups: Select2OptionData[] = [...this.scanCodeGroups];
        while (scanCodeGroups.length > 0) {
            const scanCodeGroup = scanCodeGroups.shift();
            if (predicate(scanCodeGroup)) {
                selectedOption = scanCodeGroup;
                break;
            }
            scanCodeGroups.push(...scanCodeGroup.children);
        }
        return selectedOption;
    }

    private findScancodeOptionById(id: string): Select2OptionData {
        return this.findScancodeOptionBy(option => option.id === id);
    }

    private findScancodeOptionByScancode(scancode: number, type: KeystrokeType): Select2OptionData {
        const typeToFind: string =
            (type === KeystrokeType.shortMedia || type === KeystrokeType.longMedia) ? 'media' : KeystrokeType[type];
        return this.findScancodeOptionBy((option: Select2OptionData) => {
            const additional = option.additional;
            if (additional && additional.scancode === scancode && additional.type === typeToFind) {
                return true;
            } else if ((!additional || additional.scancode === undefined) && +option.id === scancode) {
                return true;
            } else {
                return false;
            }
        });
    }

    private toScancodeTypePair(option: Select2OptionData): [number, string] {
        let scanCode: number;
        let type: string;
        if (option.additional) {
            scanCode = option.additional.scancode;
            type = option.additional.type || 'basic';
        } else {
            type = 'basic';
        }
        if (scanCode === undefined) {
            scanCode = +option.id;
        }

        return [scanCode, type];
    }

}

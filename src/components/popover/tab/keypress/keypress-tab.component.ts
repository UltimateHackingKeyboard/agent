import { Component, OnInit, ViewChild } from '@angular/core';

import { CaptureKeystrokeButtonComponent } from '../../widgets/capture-keystroke/capture-keystroke-button.component';

import { KeyAction } from '../../../../../config-serializer/config-items/KeyAction';
import { KeyModifiers } from '../../../../../config-serializer/config-items/KeyModifiers';
import { KeystrokeAction } from '../../../../../config-serializer/config-items/KeystrokeAction';
import { LongPressAction } from '../../../../../config-serializer/config-items/LongPressAction';
import { KeyActionSaver } from '../../key-action-saver';

import {IconComponent} from '../../widgets/icon/icon.component';

import {SELECT2_DIRECTIVES} from 'ng2-select2/dist/ng2-select2';
import {OptionData} from 'ng2-select2/dist/select2';

@Component({
    moduleId: module.id,
    selector: 'keypress-tab',
    template: require('./keypress-tab.component.html'),
    styles: [require('./keypress-tab.component.scss')],
    directives: [CaptureKeystrokeButtonComponent, IconComponent, SELECT2_DIRECTIVES]
})
export class KeypressTabComponent implements OnInit, KeyActionSaver {

    // TODO(@Nejc): We need a type for select2 component instead of any
    @ViewChild('scanCodeSelect') scanCodeSelect: any;
    @ViewChild('longPressSelect') longPressSelect: any;

    private leftModifiers: string[];
    private rightModifiers: string[];

    private leftModifierSelects: boolean[];
    private rightModifierSelects: boolean[];

    private scanCodeGroups: Array<OptionData>;
    private longPressGroups: Array<OptionData>;

    constructor() {
        this.leftModifiers = ['LShift', 'LCtrl', 'LSuper', 'LAlt'];
        this.rightModifiers = ['RShift', 'RCtrl', 'RSuper', 'RAlt'];
        this.scanCodeGroups = [{
            id: '0',
            text: 'None'
        }];
        this.scanCodeGroups = this.scanCodeGroups.concat(require('json!./scancodes.json'));
        this.longPressGroups = require('json!./longPress.json');
        this.leftModifierSelects = Array(4).fill(false);
        this.rightModifierSelects = Array(4).fill(false);
    }

    ngOnInit() { }

    keyActionValid(keystrokeAction?: KeystrokeAction): boolean {
        if (!keystrokeAction) {
            keystrokeAction = this.toKeyAction();
        }
        return keystrokeAction.scancode > 0 || keystrokeAction.modifierMask > 0;
    }

    toKeyAction(): KeystrokeAction {
        let keystrokeAction: KeystrokeAction = new KeystrokeAction();
        keystrokeAction.scancode = +this.scanCodeSelect.selector.nativeElement.value;

        let mapper = (x: number) => {
            if (x < 8) {
                return Math.floor(x / 2) * 4 + 1 - x; // 1, 0, 3, 2, 5, 4, 7, 6
            } else {
                return x;
            }
        };
        keystrokeAction.modifierMask = 0;
        let modifiers = this.leftModifierSelects.concat(this.rightModifierSelects).map(x => x ? 1 : 0);
        for (let i = 0; i < modifiers.length; ++i) {
            keystrokeAction.modifierMask |= modifiers[i] << mapper(i);
        }
        let selectedLongPressIndex = 0;
        let tempIndex: number;
        const selectedValue: string = this.longPressSelect.selector.nativeElement.value;
        for (let i = 0; i < this.longPressGroups.length; ++i) {
            if (this.longPressGroups[i].children) {
                tempIndex = this.longPressGroups[i].children.findIndex(x => x.id === selectedValue);
                if (tempIndex >= 0) {
                    selectedLongPressIndex += tempIndex;
                    break;
                } else {
                    selectedLongPressIndex += this.longPressGroups[i].children.length;
                }
            } else {
                if (this.longPressGroups[i].id === selectedValue) {
                    break;
                } else {
                    ++selectedLongPressIndex;
                }
            }
        }

        keystrokeAction.longPressAction = selectedLongPressIndex === 0 ? undefined : mapper(selectedLongPressIndex - 1);
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
                + state.text
                + '<span class="scancode--searchterm"> '
                + state.additional.explanation
                + '</span></span>'
            );
        } else {
            return jQuery('<span class="select2-item">' + state.text + '</span>');
        }
    }

    toggleModifier(right: boolean, index: number) {
        let modifierSelects: boolean[] = right ? this.rightModifierSelects : this.leftModifierSelects;
        modifierSelects[index] = !modifierSelects[index];
    }
}

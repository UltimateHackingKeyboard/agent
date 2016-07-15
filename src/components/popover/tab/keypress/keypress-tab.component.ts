import { Component, OnInit } from '@angular/core';

import { CaptureKeystrokeButtonComponent } from '../../widgets/capture-keystroke/capture-keystroke-button.component';

import { KeyAction } from '../../../../../config-serializer/config-items/KeyAction';
import { KeystrokeAction } from '../../../../../config-serializer/config-items/KeystrokeAction';
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
    private leftModifiers: string[];
    private rightModifiers: string[];

    private leftModifierSelects: boolean[];
    private rightModifierSelects: boolean[];

    private scanCodeGroups: Array<OptionData>;
    private longPressGroups: Array<OptionData>;

    constructor() {
        this.leftModifiers = ['LShift', 'LCtrl', 'LSuper', 'LAlt'];
        this.rightModifiers = ['RShift', 'RCtrl', 'RSuper', 'RAlt'];
        this.scanCodeGroups = require('json!./scancodes.json');
        this.longPressGroups = require('json!./longPress.json');
    }

    ngOnInit() { }

    getKeyAction(): KeystrokeAction {
        return undefined;
    }

    keyActionValid(): boolean {
        return false;
    }

    toKeyAction(): KeyAction {
        return undefined;
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
}

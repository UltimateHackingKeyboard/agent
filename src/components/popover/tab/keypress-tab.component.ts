import { Component, OnInit } from '@angular/core';

import { CaptureKeystrokeButtonComponent } from '../widgets/capture-keystroke-button.component';

import { KeyAction } from '../../../../config-serializer/config-items/KeyAction';
import { KeystrokeAction } from '../../../../config-serializer/config-items/KeystrokeAction';
import { KeystrokeModifiersAction } from '../../../../config-serializer/config-items/KeystrokeModifiersAction';
import { KeystrokeWithModifiersAction } from '../../../../config-serializer/config-items/KeystrokeWithModifiersAction';
import { KeyActionSaver } from '../key-action-saver';

import {IconComponent} from '../widgets/icon.component';

import {SELECT2_DIRECTIVES} from 'ng2-select2/dist/ng2-select2';
import {OptionData} from 'ng2-select2/dist/select2';

@Component({
    moduleId: module.id,
    selector: 'keypress-tab',
    template:
    `
        <div class="scancode-options" style="margin-bottom:10px; margin-top:2px">
            <b class="setting-label" style="position:relative; top:2px;">Scancode:</b>
            <select2 [data]="scanCodeGroups" [templateResult]="scanCodeTemplateResult" [width]="200"></select2>
            <capture-keystroke-button></capture-keystroke-button>
        </div>
        <div class="scancode-options">
            <b class="setting-label" style="position:relative; top:-9px; margin-right:4px;">Modifiers:</b>
            <div class="btn-toolbar modifiers" style="display:inline-block">
                <div class="btn-group btn-group-sm modifiers__left">
                    <button type="button" class="btn btn-default" *ngFor="let modifier of leftModifiers">
                        {{modifier}}
                    </button>
                </div>
                <div class="btn-group btn-group-sm modifiers__right">
                    <button type="button" class="btn btn-default" *ngFor="let modifier of rightModifiers">
                        {{modifier}}
                    </button>
                </div>
            </div>
        </div>
        <div class="long-press-container">
            <b class="setting-label" style="position:relative;">Long press action:</b>
            <select2 [data]="longPressGroups" [width]="140"></select2>
            <icon name="question-circle" title="This action happens when the key is being held along with another key."></icon>
        </div>
    `,
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

    getKeyAction(): KeystrokeAction | KeystrokeModifiersAction | KeystrokeWithModifiersAction {
        return;
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

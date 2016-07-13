import { Component, OnInit } from '@angular/core';

import {UhkConfigurationService} from '../../../services/uhk-configuration.service';
import {Keymap} from '../../../../config-serializer/config-items/Keymap';
import {SvgKeyboardComponent} from '../../svg-keyboard.component';
import {KeyActionSaver} from '../key-action-saver';
import {SwitchKeymapAction} from '../../../../config-serializer/config-items/SwitchKeymapAction';

import {OptionData} from 'ng2-select2/dist/select2';
import {SELECT2_DIRECTIVES} from 'ng2-select2/dist/ng2-select2';

@Component({
    moduleId: module.id,
    selector: 'keymap-tab',
    template: require('./keymap-tab.component.html'),
    styles: [require('./keymap-tab.component.scss')],
    directives: [SvgKeyboardComponent, SELECT2_DIRECTIVES]
})
export class KeymapTabComponent implements OnInit, KeyActionSaver {

    private keymaps: Keymap[];
    private keymapOptions: Array<OptionData> = [];
    private selectedKeymapIndex: number;

    constructor(private uhkConfigurationService: UhkConfigurationService) {
        this.selectedKeymapIndex = -1;
        this.keymaps = [];
    }

    ngOnInit() {
        this.keymaps = this.uhkConfigurationService.getUhkConfiguration().keymaps.elements;

        this.keymapOptions.push({
            id: '-1',
            text: 'Switch to keymap'
        });

        this.keymapOptions = this.keymapOptions.concat(this.keymaps.map(function(keymap: Keymap): OptionData {
            return {
                id: keymap.id.toString(),
                text: keymap.name
            };
        }));
    }

    // TODO: change to the correct type when the wrapper has added it.
    onChange(event: any) {
        this.selectedKeymapIndex = parseInt(event.value, 10);
    }

    keyActionValid(): boolean {
        return this.selectedKeymapIndex !== -1;
    }

    toKeyAction(): SwitchKeymapAction {
        if (!this.keyActionValid()) {
            throw new Error('KeyAction is not valid. No selected keymap!');
        }
        let keymapAction = new SwitchKeymapAction();
        keymapAction.keymapId = this.keymaps[this.selectedKeymapIndex].id;
        return keymapAction;
    }
}

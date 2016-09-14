import {Component, Input, OnInit } from '@angular/core';

import {Select2OptionData} from 'ng2-select2/ng2-select2';

import {KeyAction, SwitchKeymapAction} from '../../../../config-serializer/config-items/key-action';
import {Keymap} from '../../../../config-serializer/config-items/Keymap';
import {Tab} from '../tab';

import {UhkConfigurationService} from '../../../../services/uhk-configuration.service';

@Component({
    selector: 'keymap-tab',
    template: require('./keymap-tab.component.html'),
    styles: [require('./keymap-tab.component.scss')]
})
export class KeymapTabComponent implements OnInit, Tab {
    @Input() defaultKeyAction: KeyAction;

    private keymaps: Keymap[];
    private selectedKeymap: Keymap;
    private keymapOptions: Array<Select2OptionData>;
    private selectedKeymapIndex: string;

    constructor(private uhkConfigurationService: UhkConfigurationService) {
        this.keymaps = [];
        this.keymapOptions = [];
        this.selectedKeymapIndex = "-1";
    }

    ngOnInit() {
        this.keymaps = this.uhkConfigurationService.getUhkConfiguration().keymaps.elements;

        this.keymapOptions.push({
            id: '-1',
            text: 'Switch to keymap'
        });

        this.keymapOptions = this.keymapOptions.concat(this.keymaps.map(function (keymap: Keymap): Select2OptionData {
            return {
                id: keymap.abbreviation,
                text: keymap.name
            };
        }));

        this.fromKeyAction(this.defaultKeyAction);
    }

    // TODO: change to the correct type when the wrapper has added it.
    onChange(event: any) {
        this.selectedKeymapIndex = event.value;
        this.selectedKeymap = this.keymaps.find((keymap: Keymap) => keymap.abbreviation == this.selectedKeymapIndex);
    }

    keyActionValid(): boolean {
        return this.selectedKeymapIndex !== "-1";
    }

    fromKeyAction(keyAction: KeyAction): boolean {
        if (!(keyAction instanceof SwitchKeymapAction)) {
            return false;
        }
        let switchKeymapAction: SwitchKeymapAction = <SwitchKeymapAction>keyAction;
        this.selectedKeymapIndex = switchKeymapAction.keymapId;
        this.selectedKeymap = this.keymaps.find((keymap: Keymap) => keymap.abbreviation == this.selectedKeymapIndex);
        return true;
    }

    toKeyAction(): SwitchKeymapAction {
        if (!this.keyActionValid()) {
            throw new Error('KeyAction is not valid. No selected keymap!');
        }
        let keymapAction = new SwitchKeymapAction();
        keymapAction.keymapId = this.selectedKeymapIndex;
        return keymapAction;
    }
}

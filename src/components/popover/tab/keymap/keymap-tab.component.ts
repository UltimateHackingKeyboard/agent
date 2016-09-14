import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { Select2OptionData } from 'ng2-select2/ng2-select2';

import { KeyAction, SwitchKeymapAction } from '../../../../config-serializer/config-items/key-action';
import { Keymap } from '../../../../config-serializer/config-items/Keymap';
import { Tab } from '../tab';

@Component({
    selector: 'keymap-tab',
    template: require('./keymap-tab.component.html'),
    styles: [require('./keymap-tab.component.scss')],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeymapTabComponent implements OnInit, Tab {
    @Input() defaultKeyAction: KeyAction;
    @Input() keymaps: Keymap[];

    private keymapOptions: Array<Select2OptionData>;
    private selectedKeymap: Keymap;

    constructor() {
        this.keymapOptions = [];
    }

    ngOnInit() {
        this.keymapOptions.push({
            id: '-1',
            text: 'Switch to keymap'
        });

        this.keymapOptions = this.keymaps.map((keymap: Keymap): Select2OptionData => {
            return {
                id: keymap.abbreviation,
                text: keymap.name
            };
        });

        this.fromKeyAction(this.defaultKeyAction);
    }

    // TODO: change to the correct type when the wrapper has added it.
    onChange(event: any) {
        if (event.value === '-1') {
            this.selectedKeymap = undefined;
        } else {
            this.selectedKeymap = this.keymaps.find((keymap: Keymap) => keymap.abbreviation === event.value);
        }
    }

    keyActionValid(): boolean {
        return !!this.selectedKeymap;
    }

    fromKeyAction(keyAction: KeyAction): boolean {
        if (!(keyAction instanceof SwitchKeymapAction)) {
            return false;
        }
        let switchKeymapAction: SwitchKeymapAction = <SwitchKeymapAction>keyAction;
        this.selectedKeymap = this.keymaps
            .find((keymap: Keymap) => keymap.abbreviation === switchKeymapAction.keymapAbbreviation);
    }

    toKeyAction(): SwitchKeymapAction {
        if (!this.keyActionValid()) {
            throw new Error('KeyAction is not valid. No selected keymap!');
        }

        let keymapAction = new SwitchKeymapAction();
        keymapAction.keymapAbbreviation = this.selectedKeymap.abbreviation;
        return keymapAction;
    }
}

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
    @Input() keymaps: any;

    private keymapOptions: Array<Select2OptionData>;
    private selectedKeymap: Keymap;
    private selectedKeymapIndex: string;

    constructor() {
        this.keymapOptions = [];
        this.selectedKeymapIndex = '-1';
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
        this.selectedKeymapIndex = event.value;
        this.selectedKeymap = this.keymaps.find((keymap: Keymap) => keymap.abbreviation === this.selectedKeymapIndex);
    }

    keyActionValid(): boolean {
        return this.selectedKeymapIndex !== '-1';
    }

    fromKeyAction(keyAction: KeyAction): boolean {
        if (!(keyAction instanceof SwitchKeymapAction)) {
            return false;
        }
        let switchKeymapAction: SwitchKeymapAction = <SwitchKeymapAction>keyAction;
        this.selectedKeymapIndex = switchKeymapAction.keymapId;
        this.selectedKeymap = this.keymaps.find((keymap: Keymap) => keymap.abbreviation === this.selectedKeymapIndex);
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

import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';

import { Select2OptionData } from 'ng2-select2/ng2-select2';

import { KeyAction, SwitchKeymapAction } from '../../../../config-serializer/config-items/key-action';
import { Keymap } from '../../../../config-serializer/config-items/keymap';
import { Tab } from '../tab';

@Component({
    selector: 'keymap-tab',
    templateUrl: './keymap-tab.component.html',
    styleUrls: ['./keymap-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeymapTabComponent extends Tab implements OnInit, OnChanges {
    @Input() defaultKeyAction: KeyAction;
    @Input() keymaps: Keymap[];

    private keymapOptions: Array<Select2OptionData>;
    private selectedKeymap: Keymap;

    constructor() {
        super();
        this.keymapOptions = [];
    }

    ngOnInit() {
        this.keymapOptions = this.keymaps
            .map((keymap: Keymap): Select2OptionData => {
                return {
                    id: keymap.abbreviation,
                    text: keymap.name
                };
            });
        if (this.keymaps.length > 0) {
            this.selectedKeymap = this.keymaps[0];
        }
    }

    ngOnChanges() {
        this.fromKeyAction(this.defaultKeyAction);
        this.validAction.emit(true);
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

        const switchKeymapAction: SwitchKeymapAction = <SwitchKeymapAction>keyAction;
        this.selectedKeymap = this.keymaps
            .find((keymap: Keymap) => keymap.abbreviation === switchKeymapAction.keymapAbbreviation);
    }

    toKeyAction(): SwitchKeymapAction {
        if (!this.keyActionValid()) {
            throw new Error('KeyAction is not valid. No selected keymap!');
        }

        const keymapAction = new SwitchKeymapAction();
        keymapAction.keymapAbbreviation = this.selectedKeymap.abbreviation;
        return keymapAction;
    }
}

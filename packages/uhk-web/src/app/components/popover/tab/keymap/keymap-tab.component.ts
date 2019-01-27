import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Keymap, KeyAction, SwitchKeymapAction } from 'uhk-common';

import { Tab } from '../tab';
import { SelectOptionData } from '../../../../models/select-option-data';

@Component({
    selector: 'keymap-tab',
    templateUrl: './keymap-tab.component.html',
    styleUrls: ['./keymap-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeymapTabComponent extends Tab implements OnChanges {
    @Input() defaultKeyAction: KeyAction;
    @Input() keymaps: Keymap[];

    keymapOptions: Array<SelectOptionData>;
    selectedKeymap: Keymap;

    constructor() {
        super();
        this.keymapOptions = [];
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.keymaps) {
            this.keymapOptions = this.keymaps.map(
                (keymap: Keymap): SelectOptionData => {
                    return {
                        id: keymap.abbreviation,
                        text: keymap.name
                    };
                }
            );
            if (this.keymaps.length > 0) {
                this.selectedKeymap = this.keymaps[0];
            }
        }

        this.fromKeyAction(this.defaultKeyAction);
        this.validAction.emit(true);
    }

    onChange(event: string) {
        if (event === '-1') {
            this.selectedKeymap = undefined;
        } else {
            this.selectedKeymap = this.keymaps.find((keymap: Keymap) => keymap.abbreviation === event);
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
        this.selectedKeymap = this.keymaps.find(
            (keymap: Keymap) => keymap.abbreviation === switchKeymapAction.keymapAbbreviation
        );
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

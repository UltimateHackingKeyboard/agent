import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';

import { Keymap } from '../../../config-serializer/config-items/Keymap';
import { KeymapActions } from '../../../store/actions/keymap';
import { AppState } from '../../../store/index';

@Component({
    selector: 'keymap-header',
    template: require('./keymap-header.component.html'),
    styles: [require('./keymap-header.component.scss')]
})
export class KeymapHeaderComponent {
    @Input() keymap: Keymap;

    constructor(
        private store: Store<AppState>,
        private keymapActions: KeymapActions
    ) { }

    setDefault(id: string) {
        if (!this.keymap.isDefault) {
            this.store.dispatch(this.keymapActions.setDefault(id));
        }
    }

    removeKeymap(id: string) {
        this.store.dispatch(this.keymapActions.removeKeymap(id));
    }

    duplicateKeymap(keymap: Keymap) {
        this.store.dispatch(this.keymapActions.duplicateKeymap(keymap));
    }

    editTitleKeymap(id: string, title: string) {
        this.store.dispatch(this.keymapActions.editTitleKeymap(id, title));
    }

    editAbbrKeymap(id: string, abbr: string) {
        this.store.dispatch(this.keymapActions.editAbbrKeymap(id, abbr));
    }
}

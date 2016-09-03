import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import 'rxjs/add/operator/debounceTime';
import { Observable } from 'rxjs/Rx';

import { Keymap } from '../../../config-serializer/config-items/Keymap';
import { KeymapActions } from '../../../store/actions/keymap';
import { AppState } from '../../../store/index';

@Component({
    selector: 'keymap-add',
    template: require('./keymap-add.component.html'),
    styles: [require('./keymap-add.component.scss')]
})
export class KeymapAddComponent {
    private keymaps$: Observable<Keymap[]>;
    private keymapsAll$: Observable<Keymap[]>;

    constructor(private store: Store<AppState>, private keymapActions: KeymapActions) {
        this.keymapsAll$ = store.select(s => s.preset);
        this.keymaps$ = store.select(s => s.preset);
    }

    filterKeyboards(value: string) {
        this.keymaps$ = this.keymapsAll$
            .map((items: Keymap[]) => items.filter(
                (item: Keymap) => item.name.toLocaleLowerCase().indexOf(value) !== -1)
            );
    }

    addKeymap(item: Keymap) {
        this.store.dispatch(this.keymapActions.add(item));
    }
}

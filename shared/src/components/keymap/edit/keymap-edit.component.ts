import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import '@ngrx/core/add/operator/select';
import { Store } from '@ngrx/store';

import 'rxjs/add/operator/let';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { Keymap } from '../../../config-serializer/config-items/Keymap';
import { AppState } from '../../../store';
import { getKeymap, getKeymapEntities } from '../../../store/reducers/keymap';

@Component({
    selector: 'keymap-edit',
    template: require('./keymap-edit.component.html'),
    styles: [require('./keymap-edit.component.scss')],
    host: {
        'class': 'container-fluid'
    }
})
export class KeymapEditComponent {

    protected keymap$: Observable<Keymap>;
    private deletable$: Observable<boolean>;

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute
    ) {
        this.keymap$ = route
            .params
            .select<string>('abbr')
            .switchMap((abbr: string) => store.let(getKeymap(abbr)))
            .publishReplay(1)
            .refCount();

        this.deletable$ = store.let(getKeymapEntities())
            .map((keymaps: Keymap[]) => keymaps.length > 1);
    }

}

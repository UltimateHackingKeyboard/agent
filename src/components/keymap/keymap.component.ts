import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import '@ngrx/core/add/operator/select';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/let';

import { Keymap } from '../../config-serializer/config-items/Keymap';
import { AppState } from '../../store/index';
import { getKeymap } from '../../store/reducers/keymap';

@Component({
    selector: 'keymap',
    template: require('./keymap.component.html'),
    styles: [require('./keymap.component.scss')]
})
export class KeymapComponent {
    private keymap$: Observable<Keymap>;

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute
    ) {
        this.keymap$ = route
            .params
            .select<string>('id')
            .switchMap((id: string) => store.let(getKeymap(id)));
    }
}

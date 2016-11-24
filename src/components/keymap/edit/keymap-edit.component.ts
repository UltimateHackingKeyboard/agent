import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import '@ngrx/core/add/operator/select';
import { Store } from '@ngrx/store';

import 'rxjs/add/operator/let';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';

import { Keymap } from '../../../config-serializer/config-items/Keymap';
import { AppState } from '../../../store';
import { getKeymap } from '../../../store/reducers/keymap';

@Component({
    selector: 'keymap-edit',
    template: require('./keymap-edit.component.html'),
    styles: [require('./keymap-edit.component.scss')],
    host: {
        'class': 'container-fluid'
    }
})
export class KeymapEditComponent {
    private keymap$: Observable<Keymap>;

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute
    ) {
        let keymapConnectable: ConnectableObservable<Keymap> = route
            .params
            .select<string>('abbr')
            .switchMap((abbr: string) => store.let(getKeymap(abbr)))
            .publishReplay();

        this.keymap$ = keymapConnectable;
        keymapConnectable.connect();
    }
}

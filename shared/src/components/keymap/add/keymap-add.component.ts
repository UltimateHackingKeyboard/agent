import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/publishReplay';

import { Keymap } from '../../../config-serializer/config-items/Keymap';
import { AppState } from '../../../store';
import { KeymapActions } from '../../../store/actions';

@Component({
    selector: 'keymap-add',
    templateUrl: './keymap-add.component.html',
    styleUrls: ['./keymap-add.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class KeymapAddComponent {
    presets$: Observable<Keymap[]>;
    private presetsAll$: Observable<Keymap[]>;
    private filterExpression$: BehaviorSubject<string>;

    constructor(private store: Store<AppState>) {
        this.presetsAll$ = store.select((appState: AppState) => appState.presetKeymaps);
        this.filterExpression$ = new BehaviorSubject('');

        this.presets$ = this.presetsAll$
            .combineLatest(this.filterExpression$, (keymaps: Keymap[], filterExpression: string) => {
                return keymaps.filter((keymap: Keymap) => keymap.name.toLocaleLowerCase().includes(filterExpression));
            })
            .publishReplay(1)
            .refCount();
    }

    filterKeyboards(filterExpression: string) {
        this.filterExpression$.next(filterExpression);
    }

    addKeymap(keymap: Keymap) {
        this.store.dispatch(KeymapActions.addKeymap(keymap));
    }
}

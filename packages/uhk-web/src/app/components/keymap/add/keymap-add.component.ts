import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Keymap } from 'uhk-common';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest, publishReplay, refCount } from 'rxjs/operators';

import { AppState } from '../../../store';
import { KeymapActions } from '../../../store/actions';

@Component({
    selector: 'keymap-add',
    templateUrl: './keymap-add.component.html',
    styleUrls: ['./keymap-add.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'container-fluid',
    },
})
export class KeymapAddComponent {
    presets$: Observable<Keymap[]>;
    presetsAll$: Observable<Keymap[]>;
    private filterExpression$: BehaviorSubject<string>;

    constructor(private store: Store<AppState>) {
        this.presetsAll$ = store.select((appState: AppState) => appState.presetKeymaps);
        this.filterExpression$ = new BehaviorSubject('');

        this.presets$ = this.presetsAll$.pipe(
            combineLatest(this.filterExpression$, (keymaps: Keymap[], filterExpression: string) => {
                return keymaps.filter((keymap: Keymap) => keymap.name.toLocaleLowerCase().includes(filterExpression));
            }),
            publishReplay(1),
            refCount(),
        );
    }

    filterKeyboards(filterExpression: string) {
        this.filterExpression$.next(filterExpression);
    }

    addKeymap(keymap: Keymap) {
        this.store.dispatch(KeymapActions.addKeymap(keymap));
    }
}

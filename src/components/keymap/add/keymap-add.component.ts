import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import 'rxjs/add/operator/combineLatest';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Keymap } from '../../../config-serializer/config-items/Keymap';
import { AppState } from '../../../store';
import { KeymapActions } from '../../../store/actions';

@Component({
    selector: 'keymap-add',
    template: require('./keymap-add.component.html'),
    styles: [require('./keymap-add.component.scss')]
})
export class KeymapAddComponent implements OnDestroy {
    private presets: Keymap[];
    private presetsAll$: Observable<Keymap[]>;
    private filterExpression$: BehaviorSubject<string>;
    private subscription: Subscription;

    constructor(private store: Store<AppState>) {
        this.presetsAll$ = store.select((appState: AppState) => appState.presetKeymaps);
        this.filterExpression$ = new BehaviorSubject('');

        this.subscription = this.presetsAll$.combineLatest(
            this.filterExpression$,
            (keymaps: Keymap[], filterExpression: string) => {
                return keymaps.filter((keymap: Keymap) => keymap.name.toLocaleLowerCase().includes(filterExpression));
            }
        ).subscribe(keymaps => this.presets = keymaps);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    filterKeyboards(filterExpression: string) {
        this.filterExpression$.next(filterExpression);
    }

    addKeymap(keymap: Keymap) {
        this.store.dispatch(KeymapActions.addKeymap(keymap));
    }
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/observable/of';

import { Keymap } from 'uhk-common';
import { KeymapActions } from '../actions';
import { AppState } from '../index';

@Injectable()
export class KeymapEffects {

    @Effect() loadKeymaps$: Observable<Action> = this.actions$
        .ofType(KeymapActions.LOAD_KEYMAPS)
        .startWith(KeymapActions.loadKeymaps())
        .switchMap(() => {
            const presetsRequireContext = (<any>require).context('../../../res/presets', false, /.json$/);
            const uhkPresets = presetsRequireContext.keys().map(presetsRequireContext) // load the presets into an array
                .map((keymap: any) => new Keymap().fromJsonObject(keymap));

            return Observable.of(KeymapActions.loadKeymapsSuccess(uhkPresets));
        });

    @Effect({ dispatch: false }) addOrDuplicate$: any = this.actions$
        .ofType(KeymapActions.ADD, KeymapActions.DUPLICATE)
        .withLatestFrom(this.store)
        .map(latest => latest[1].userConfiguration.keymaps)
        .do(keymaps => {
            this.router.navigate(['/keymap', keymaps[keymaps.length - 1].abbreviation]);
        });

    @Effect({ dispatch: false }) remove$: any = this.actions$
        .ofType(KeymapActions.REMOVE)
        .withLatestFrom(this.store)
        .map(latest => latest[1].userConfiguration.keymaps)
        .do(keymaps => {
            if (keymaps.length === 0) {
                this.router.navigate(['/keymap/add']);
            } else {
                const favourite: Keymap = keymaps.find(keymap => keymap.isDefault);
                this.router.navigate(['/keymap', favourite.abbreviation]);
            }
        });

    @Effect({ dispatch: false }) editAbbr$: any = this.actions$
        .ofType(KeymapActions.EDIT_ABBR)
        .withLatestFrom(this.store)
        .do(([action, store]) => {
            for (const keymap of store.userConfiguration.keymaps) {
                if (keymap.name === action.payload.name && keymap.abbreviation === action.payload.newAbbr) {
                    this.router.navigate(['/keymap', action.payload.newAbbr]);
                    return;
                }
            }
        });

    constructor(private actions$: Actions, private router: Router, private store: Store<AppState>) { }
}

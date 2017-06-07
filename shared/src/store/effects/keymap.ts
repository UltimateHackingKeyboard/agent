import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/observable/of';

import { KeymapActions } from '../actions';
import { AppState } from '../index';

import { Keymap } from '../../config-serializer/config-items/Keymap';

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
        .map(action => action.payload.newAbbr)
        .do(newAbbr => {
            this.router.navigate(['/keymap', newAbbr]);
        });

    constructor(private actions$: Actions, private router: Router, private store: Store<AppState>) { }
}

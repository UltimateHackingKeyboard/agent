import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, pairwise, startWith, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { Keymap } from 'uhk-common';
import { findNewItem } from '../../util';
import * as Keymaps from '../actions/keymap';
import { AppState, getKeymaps } from '../index';

@Injectable()
export class KeymapEffects {

    @Effect() loadKeymaps$: Observable<Action> = this.actions$
        .ofType(Keymaps.ActionTypes.LoadKeymaps)
        .pipe(
            startWith(new Keymaps.LoadKeymapsAction()),
            switchMap(() => {
                const presetsRequireContext = (<any>require).context('../../../res/presets', false, /.json$/);
                const uhkPresets = presetsRequireContext.keys().map(presetsRequireContext) // load the presets into an array
                    .map((keymap: any) => new Keymap().fromJsonObject(keymap));

                return of(new Keymaps.LoadKeymapSuccessAction(uhkPresets));
            })
        );

    @Effect({ dispatch: false }) addOrDuplicate$: any = this.actions$
        .ofType(Keymaps.ActionTypes.Add, Keymaps.ActionTypes.Duplicate)
        .pipe(
            withLatestFrom(this.store.select(getKeymaps)
                .pipe(
                    pairwise()
                )
            ),
            map(([action, latest]) => latest),
            tap(([prevKeymaps, newKeymaps]) => {
                const newKeymap = findNewItem(prevKeymaps, newKeymaps);
                this.router.navigate(['/keymap', newKeymap.abbreviation]);
            })
        );

    @Effect({ dispatch: false }) remove$: any = this.actions$
        .ofType(Keymaps.ActionTypes.Remove)
        .pipe(
            withLatestFrom(this.store.select(getKeymaps)),
            map(latest => latest[1]),
            tap(keymaps => {
                if (keymaps.length === 0) {
                    this.router.navigate(['/keymap/add']);
                } else {
                    const favourite: Keymap = keymaps.find(keymap => keymap.isDefault);
                    this.router.navigate(['/keymap', favourite.abbreviation]);
                }
            })
        );

    @Effect({ dispatch: false }) editAbbr$: any = this.actions$
        .ofType(Keymaps.ActionTypes.EditAbbr)
        .pipe(
            withLatestFrom(this.store.select(getKeymaps)),
            tap(([action, keymaps]: [Keymaps.EditKeymapAbbreviationAction, Keymap[]]) => {
                for (const keymap of keymaps) {
                    if (keymap.name === action.payload.name && keymap.abbreviation === action.payload.newAbbr) {
                        this.router.navigate(['/keymap', action.payload.newAbbr]);
                        return;
                    }
                }
            })
        );

    constructor(private actions$: Actions, private router: Router, private store: Store<AppState>) { }
}

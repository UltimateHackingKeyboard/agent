import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, pairwise, tap, withLatestFrom } from 'rxjs/operators';

import { Keymap } from 'uhk-common';
import { findNewItem } from '../../util';
import * as Keymaps from '../actions/keymap';
import { AppState, getKeymaps } from '../index';

@Injectable()
export class KeymapEffects {

    addOrDuplicate$ = createEffect(() => this.actions$
        .pipe(
            ofType(Keymaps.ActionTypes.Add, Keymaps.ActionTypes.Duplicate),
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
        ),
    { dispatch: false }
    );

    remove$ = createEffect(() => this.actions$
        .pipe(
            ofType(Keymaps.ActionTypes.Remove),
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
        ),
    { dispatch: false }
    );

    editAbbr$ = createEffect(() => this.actions$
        .pipe(
            ofType(Keymaps.ActionTypes.EditAbbr),
            withLatestFrom(this.store.select(getKeymaps)),
            tap(([action, keymaps]: [Keymaps.EditKeymapAbbreviationAction, Keymap[]]) => {
                for (const keymap of keymaps) {
                    if (keymap.name === action.payload.name && keymap.abbreviation === action.payload.newAbbr) {
                        this.router.navigate(['/keymap', action.payload.newAbbr]);
                        return;
                    }
                }
            })
        ),
    { dispatch: false }
    );

    constructor(private actions$: Actions, private router: Router, private store: Store<AppState>) {
    }
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/withLatestFrom';

import { KeymapActions } from '../actions';
import { AppState } from '../index';

import { Keymap } from '../../config-serializer/config-items/Keymap';

@Injectable()
export class KeymapEffects {

    @Effect({ dispatch: false })add$: any = this.actions$
        .ofType(KeymapActions.ADD)
        .withLatestFrom(this.store)
        .do((latest) => {
            const state: AppState = latest[1];
            const entities: Keymap[] = state.keymaps.entities;
            this.router.navigate(['/keymap', entities[entities.length - 1].abbreviation]);
        });

    @Effect({ dispatch: false }) duplicate$: any = this.actions$
        .ofType(KeymapActions.DUPLICATE)
        .withLatestFrom(this.store)
        .do((latest) => {
            const state: AppState = latest[1];
            const entities: Keymap[] = state.keymaps.entities;
            this.router.navigate(['/keymap', entities[entities.length - 1].abbreviation]);
        });

    @Effect({ dispatch: false })remove$: any = this.actions$
        .ofType(KeymapActions.REMOVE)
        .withLatestFrom(this.store)
        .do((latest) => {
            const state: AppState = latest[1];

            if (state.keymaps.entities.length === 0) {
                this.router.navigate(['/keymap/add']);
            } else {
                const favourite: Keymap = state.keymaps.entities.find(keymap => keymap.isDefault);
                this.router.navigate(['/keymap', favourite.abbreviation]);
            }
        });

    @Effect({ dispatch: false }) editAbbr$: any = this.actions$
        .ofType(KeymapActions.EDIT_ABBR)
        .withLatestFrom(this.store)
        .do((latest) => {
            const state: AppState = latest[1];
            this.router.navigate(['/keymap', state.keymaps.newAbbr]);
        });

    constructor(private actions$: Actions, private router: Router, private store: Store<AppState>) {}
}

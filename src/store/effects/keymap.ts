import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/withLatestFrom';

import { KeymapActions } from '../actions';
import { AppState } from '../index';

@Injectable()
export class KeymapEffects {

    @Effect({ dispatch: false })remove$: any = this.actions$
        .ofType(KeymapActions.REMOVE)
        .withLatestFrom(this.store)
        .do((latest) => {
            let state: AppState = latest[1];

            if (state.keymaps.entities.length === 0) {
                this.router.navigate(['/keymap/add']);
            } else {
                this.router.navigate(['/keymap']);
            }
        });

    @Effect({ dispatch: false }) editAbbr$: any = this.actions$
        .ofType(KeymapActions.EDIT_ABBR)
        .withLatestFrom(this.store)
        .do((latest) => {
            let state: AppState = latest[1];
            this.router.navigate(['/keymap', state.keymaps.newAbbr]);
        });

    constructor(private actions$: Actions, private router: Router, private store: Store<AppState>) {}
}

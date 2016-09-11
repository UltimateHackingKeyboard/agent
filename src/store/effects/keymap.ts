import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';

import { KeymapActions } from '../actions/keymap';

@Injectable()
export class KeymapEffects {

    @Effect()remove$: any = this.actions$
        .ofType(KeymapActions.REMOVE)
        .map(() => {
            // Waiting for the fix: https://github.com/angular/angular/issues/10770
            // // router.navigate(['/keymap']);
        });

    constructor(
        private actions$: Actions
    ) {}
}

import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';

import { KeymapActions } from '../actions/keymap';

@Injectable()
export class KeymapEffects {

    @Effect()remove$: any = this.actions$
        .ofType(KeymapActions.REMOVE)
        .map(() => {
            // Waiting for the fix: https://github.com/angular/angular/issues/10770
            // If state is empty router.navigate(['/keymap']);
            // Else router.navigate(['/keymap']);
        });

    @Effect() editAbbr$: any = this.actions$
        .ofType(KeymapActions.EDIT_ABBR)
        .map<string>(action => action.payload.abbr)
        .map((id: string) => {
            console.log(id);
            // Waiting for the fix: https://github.com/angular/angular/issues/10770
            // // router.navigate(['/keymap', id]);
        });

    constructor(
        private actions$: Actions
    ) {}
}

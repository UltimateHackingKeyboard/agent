import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';

import 'rxjs/add/operator/map';

import { KeymapActions } from '../actions/keymap';

@Injectable()
export class KeymapEffects {

    @Effect()remove$: any = this.actions$
        .ofType(KeymapActions.REMOVE)
        .map(() => {
            // TODO: Waiting for the fix: https://github.com/angular/angular/issues/10770
            // If state is empty router.navigate(['/keymap']);
            // Else router.navigate(['/keymap']);
        });

    @Effect() editAbbr$: any = this.actions$
        .ofType(KeymapActions.EDIT_ABBR)
        .map<string>(action => action.payload.abbr)
        .map((abbr: string) => {
            console.log(abbr);
            // TODO: Waiting for the fix: https://github.com/angular/angular/issues/10770
            // // router.navigate(['/keymap', abbr]);
        });

    constructor(
        private actions$: Actions
    ) {}
}

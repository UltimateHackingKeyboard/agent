import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';

import 'rxjs/add/operator/map';

import { MacroActions } from '../actions';

@Injectable()
export class MacroEffects {

    @Effect()remove$: any = this.actions$
        .ofType(MacroActions.REMOVE)
        .map(() => {
            // TODO: Waiting for the fix: https://github.com/angular/angular/issues/10770
            // If state is empty router.navigate(['/macro']);
            // Else router.navigate(['/macro']);
        });

    constructor(private actions$: Actions) {}
}

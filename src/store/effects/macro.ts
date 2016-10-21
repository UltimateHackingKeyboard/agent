import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/withLatestFrom';

import { MacroActions } from '../actions';
import { AppState } from '../index';

@Injectable()
export class MacroEffects {

    @Effect({dispatch: false}) remove$: any = this.actions$
        .ofType(MacroActions.REMOVE)
        .withLatestFrom(this.store)
        .do((latest) => {
            let state: AppState = latest[1];

            if (state.macros.entities.length === 0) {
                this.router.navigate(['/macro/add']);
            } else {
                this.router.navigate(['/macro']);
            }
        });

    @Effect({dispatch: false}) add$: any = this.actions$
        .ofType(MacroActions.ADD)
        .withLatestFrom(this.store)
        .do((latest) => {
            let state: AppState = latest[1];
            let id: number = state.macros.entities.length - 1;

            this.router.navigate(['/macro', id, 'new']);
        });

    constructor(private actions$: Actions, private router: Router, private store: Store<AppState>) {}
}

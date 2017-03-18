import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/withLatestFrom';

import { KeymapActions, MacroActions } from '../actions';
import { AppState } from '../index';

@Injectable()
export class MacroEffects {

    @Effect({dispatch: false}) remove$: any = this.actions$
        .ofType(MacroActions.REMOVE)
        .map(action => this.store.dispatch(KeymapActions.checkMacro(action.payload)))
        .withLatestFrom(this.store)
        .map(latest => latest[1].userConfiguration.macros)
        .do(macros => {
            if (macros.length === 0) {
                this.router.navigate(['/macro']);
            } else {
                this.router.navigate(['/macro', macros[0].id]);
            }
        });

    @Effect({dispatch: false}) add$: any = this.actions$
        .ofType(MacroActions.ADD)
        .withLatestFrom(this.store)
        .map(latest => latest[1].userConfiguration.macros)
        .map(macros => macros[macros.length - 1])
        .do(lastMacro => {
            this.router.navigate(['/macro', lastMacro.id, 'new']);
        });

    constructor(private actions$: Actions, private router: Router, private store: Store<AppState>) {}
}

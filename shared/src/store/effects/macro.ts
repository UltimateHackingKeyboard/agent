import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/withLatestFrom';

import { Macro } from '../../config-serializer/config-items/Macro';

import { KeymapActions, MacroActions } from '../actions';
import { AppState } from '../index';

@Injectable()
export class MacroEffects {

    @Effect({dispatch: false}) remove$: any = this.actions$
        .ofType(MacroActions.REMOVE)
        .map(action => this.store.dispatch(KeymapActions.checkMacro(action.payload)))
        .withLatestFrom(this.store)
        .do((latest) => {
            const state: AppState = latest[1];
            const macro: Macro[] = state.macros.entities;

            if (state.macros.entities.length === 0) {
                this.router.navigate(['/macro']);
            } else {
                this.router.navigate(['/macro', macro[0].id]);
            }
        });

    @Effect({dispatch: false}) add$: any = this.actions$
        .ofType(MacroActions.ADD)
        .withLatestFrom(this.store)
        .do((latest) => {
            const state: AppState = latest[1];
            const macro: Macro = state.macros.entities[state.macros.entities.length - 1];

            this.router.navigate(['/macro', macro.id, 'new']);
        });

    constructor(private actions$: Actions, private router: Router, private store: Store<AppState>) {}
}

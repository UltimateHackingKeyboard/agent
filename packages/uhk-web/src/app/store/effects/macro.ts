import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { map, pairwise, tap, withLatestFrom } from 'rxjs/operators';

import { Macro } from 'uhk-common';
import { KeymapActions, MacroAction, MacroActions } from '../actions';
import { AppState } from '../index';
import { getMacros } from '../reducers/user-configuration';
import { findNewItem } from '../../util';

@Injectable()
export class MacroEffects {

    @Effect({ dispatch: false }) remove$: any = this.actions$
        .ofType<MacroAction>(MacroActions.REMOVE)
        .pipe(
            tap(action => this.store.dispatch(KeymapActions.checkMacro(action.payload))),
            withLatestFrom(this.store),
            map(([action, state]) => state.userConfiguration.macros),
            tap(macros => {
                    if (macros.length === 0) {
                        return this.router.navigate(['/macro']);
                    }

                    return this.router.navigate(['/macro', macros[0].id]);
                }
            )
        );

    @Effect({ dispatch: false }) addOrDuplicate$: any = this.actions$
        .ofType<MacroAction>(MacroActions.ADD, MacroActions.DUPLICATE)
        .pipe(
            withLatestFrom(this.store.let(getMacros())
                .pipe(
                    pairwise()
                )
            ),
            map(([action, latest]) => ([action, latest[0], latest[1]])),
            tap(([action, prevMacros, newMacros]: [Action, Macro[], Macro[]]) => {
                const newMacro = findNewItem(prevMacros, newMacros);
                const commands = ['/macro', newMacro.id];
                if (action.type === MacroActions.ADD) {
                    commands.push('new');
                }
                this.router.navigate(commands);
            })
        );

    constructor(private actions$: Actions,
                private router: Router,
                private store: Store<AppState>) {
    }
}

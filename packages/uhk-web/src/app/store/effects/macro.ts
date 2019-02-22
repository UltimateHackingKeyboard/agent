import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { map, pairwise, tap, withLatestFrom } from 'rxjs/operators';

import { Macro } from 'uhk-common';
import * as Keymaps from '../actions/keymap';
import * as Macros from '../actions/macro';
import { AppState, getMacros } from '..';
import { findNewItem } from '../../util';

@Injectable()
export class MacroEffects {

    @Effect({ dispatch: false }) remove$: any = this.actions$
        .ofType<Macros.RemoveMacroAction>(Macros.ActionTypes.Remove)
        .pipe(
            tap(action => this.store.dispatch(new Keymaps.CheckMacroAction(action.payload))),
            withLatestFrom(this.store.select(getMacros)),
            map(([action, macros]) => macros),
            tap(macros => {
                    if (macros.length === 0) {
                        return this.router.navigate(['/macro']);
                    }

                    return this.router.navigate(['/macro', macros[0].id]);
                }
            )
        );

    @Effect({ dispatch: false }) addOrDuplicate$: any = this.actions$
        .ofType(Macros.ActionTypes.Add, Macros.ActionTypes.Duplicate)
        .pipe(
            withLatestFrom(this.store.select(getMacros)
                .pipe(
                    pairwise()
                )
            ),
            map(([action, latest]) => ([action, latest[0], latest[1]])),
            tap(([action, prevMacros, newMacros]: [Action, Macro[], Macro[]]) => {
                const newMacro = findNewItem(prevMacros, newMacros);
                const commands = ['/macro', newMacro.id];
                if (action.type === Macros.ActionTypes.Add) {
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

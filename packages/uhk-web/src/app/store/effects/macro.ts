import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { map, pairwise, tap, withLatestFrom } from 'rxjs/operators';

import { Macro } from 'uhk-common';
import * as Keymaps from '../actions/keymap';
import * as Macros from '../actions/macro';
import { AppState, getSelectedMacroIdAfterRemove, getMacros } from '..';
import { findNewItem } from '../../util';

@Injectable()
export class MacroEffects {

    @Effect({ dispatch: false }) remove$: any = this.actions$
        .pipe(
            ofType<Macros.RemoveMacroAction>(Macros.ActionTypes.Remove),
            tap(action => this.store.dispatch(new Keymaps.CheckMacroAction(action.payload))),
            withLatestFrom(this.store.select(getSelectedMacroIdAfterRemove)),
            map(([, newMacroId]) => newMacroId),
            tap(newMacroId => {
                if (newMacroId) {
                    return this.router.navigate(['/macro', newMacroId]);
                }

                return this.router.navigate(['/macro']);
            })
        );

    @Effect({ dispatch: false }) addOrDuplicate$: any = this.actions$
        .pipe(
            ofType<Macros.AddMacroAction | Macros.DuplicateMacroAction>(
                Macros.ActionTypes.Add, Macros.ActionTypes.Duplicate),
            withLatestFrom(this.store.select(getMacros)
                .pipe(
                    pairwise()
                )
            ),
            map(([action, latest]: [Action, Macro[][]]) => ([action, latest[0], latest[1]])),
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

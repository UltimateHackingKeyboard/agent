import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { routerNavigatedAction } from '@ngrx/router-store';
import { distinctUntilChanged, map, tap, withLatestFrom } from 'rxjs/operators';

import { Macro } from 'uhk-common';
import * as Keymaps from '../actions/keymap';
import * as Macros from '../actions/macro';
import { AppState, getSelectedMacro } from '..';
import { SelectMacroAction } from '../actions/macro';

@Injectable()
export class MacroEffects {

    macroNavigated$ = createEffect(() => this.actions$
        .pipe(
            ofType(routerNavigatedAction),
            map(action => (action.payload.routerState as any).params.macroId),
            distinctUntilChanged(),
            map(macroId => new SelectMacroAction(+macroId))
        ));

    @Effect({ dispatch: false }) remove$: any = this.actions$
        .pipe(
            ofType<Macros.RemoveMacroAction>(Macros.ActionTypes.Remove),
            tap(action => this.store.dispatch(new Keymaps.CheckMacroAction(action.payload))),
            withLatestFrom(this.store.select(getSelectedMacro)),
            map(([, newMacro]) => newMacro),
            tap(this.navigateToNewMacro.bind(this))

        );

    @Effect({ dispatch: false }) addOrDuplicate$: any = this.actions$
        .pipe(
            ofType<Macros.AddMacroAction | Macros.DuplicateMacroAction>(
                Macros.ActionTypes.Add, Macros.ActionTypes.Duplicate),
            withLatestFrom(this.store.select(getSelectedMacro)),
            map(([, newMacro]) => newMacro),
            tap(this.navigateToNewMacro.bind(this))
        );

    private navigateToNewMacro(newMacro: Macro): Promise<boolean> {
        if (newMacro) {
            return this.router.navigate(['/macro', newMacro.id]);
        }

        return this.router.navigate(['/macro']);
    }

    constructor(private actions$: Actions,
                private router: Router,
                private store: Store<AppState>) {
    }
}

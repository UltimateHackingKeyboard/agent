import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/withLatestFrom';

import { Macro } from 'uhk-common';
import { KeymapActions, MacroActions } from '../actions';
import { AppState } from '../index';
import { getMacros } from '../reducers/user-configuration';
import { findNewItem } from '../../util';

@Injectable()
export class MacroEffects {

    @Effect({ dispatch: false }) remove$: any = this.actions$
        .ofType(MacroActions.REMOVE)
        .do<any>(action => this.store.dispatch(KeymapActions.checkMacro(action.payload)))
        .withLatestFrom(this.store)
        .map(([action, state]) => state.userConfiguration.macros)
        .do(macros => {
            if (macros.length === 0) {
                this.router.navigate(['/macro']);
            } else {
                this.router.navigate(['/macro', macros[0].id]);
            }
        });

    @Effect({ dispatch: false }) addOrDuplicate$: any = this.actions$
        .ofType(MacroActions.ADD, MacroActions.DUPLICATE)
        .withLatestFrom(this.store.let(getMacros()).pairwise(), (action, latest) => ([action, latest[0], latest[1]]))
        .do(([action, prevMacros, newMacros]: [Action, Macro[], Macro[]]) => {
            const newMacro = findNewItem(prevMacros, newMacros);
            const commands = ['/macro', newMacro.id];
            if (action.type === MacroActions.ADD) {
                commands.push('new');
            }
            this.router.navigate(commands);
        });

    constructor(private actions$: Actions, private router: Router, private store: Store<AppState>) { }
}

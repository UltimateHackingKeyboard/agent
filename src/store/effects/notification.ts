import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/withLatestFrom';

import { KeymapActions, MacroActions, NotificationActions } from '../actions';
import { AppState } from '../index';

@Injectable()
export class NotificationEffects {

    @Effect({dispatch: false}) show$: any = this.actions$
        .do((action) => {
            if (action.type.startsWith(KeymapActions.PREFIX) || action.type.startsWith(MacroActions.PREFIX)) {
                this.store.dispatch(NotificationActions.showNotification('working'));
            }
        });

    constructor(private actions$: Actions, private store: Store<AppState>) {}
}

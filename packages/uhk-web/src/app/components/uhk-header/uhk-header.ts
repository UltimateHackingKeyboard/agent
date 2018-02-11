import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Notification } from 'uhk-common';
import { AppState, getUndoableNotification } from '../../store';
import { DismissUndoNotificationAction, UndoLastAction } from '../../store/actions/app';

@Component({
    selector: 'uhk-header',
    templateUrl: './uhk-header.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UhkHeader {
    undoableNotification$: Observable<Notification>;

    constructor(private store: Store<AppState>) {
        this.undoableNotification$ = this.store.select(getUndoableNotification);
    }

    onUndoLastNotification(data: any): void {
        this.store.dispatch(new UndoLastAction(data));
    }

    onDismissLastNotification(): void {
        this.store.dispatch(new DismissUndoNotificationAction());
    }

}

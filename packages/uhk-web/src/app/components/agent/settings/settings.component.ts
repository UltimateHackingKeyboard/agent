import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState, appUpdateSettingsState } from '../../../store';
import { State as UpdateSettingsState } from '../../../store/reducers/auto-update-settings';
import {
    CheckForUpdateNowAction,
    ToggleCheckForUpdateOnStartupAction
} from '../../../store/actions/auto-update-settings';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class SettingsComponent {
    updateSettingsState$: Observable<UpdateSettingsState>;

    constructor(private store: Store<AppState>) {
        this.updateSettingsState$ = store.select(appUpdateSettingsState);
    }

    toggleCheckForUpdateOnStartUp(value: boolean) {
        this.store.dispatch(new ToggleCheckForUpdateOnStartupAction(value));
    }

    checkForUpdate(allowPrerelease: boolean): void {
        this.store.dispatch(new CheckForUpdateNowAction(allowPrerelease));
    }
}

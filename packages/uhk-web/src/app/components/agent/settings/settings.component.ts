import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AutoUpdateSettings } from 'uhk-common';

import { AppState, getAutoUpdateSettings, getCheckingForUpdate } from '../../../store';
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
    autoUpdateSettings$: Observable<AutoUpdateSettings>;
    checkingForUpdate$: Observable<boolean>;

    constructor(private store: Store<AppState>) {
        this.autoUpdateSettings$ = store.select(getAutoUpdateSettings);
        this.checkingForUpdate$ = store.select(getCheckingForUpdate);
    }

    toogleCheckForUpdateOnStartUp(value: boolean) {
        this.store.dispatch(new ToggleCheckForUpdateOnStartupAction(value));
    }

    checkForUpdate(allowPrerelease: boolean): void {
        this.store.dispatch(new CheckForUpdateNowAction(allowPrerelease));
    }
}

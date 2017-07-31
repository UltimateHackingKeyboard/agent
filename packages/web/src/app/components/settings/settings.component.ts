import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState, getAutoUpdateSettings, getCheckingForUpdate } from '../../store';
import {
    CheckForUpdateNowAction,
    ToggleCheckForUpdateOnStartupAction,
    TogglePreReleaseFlagAction
} from '../../store/actions/auto-update-settings';
import { AutoUpdateSettings } from '../../models/auto-update-settings';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class SettingsComponent {
    // TODO: From where do we get the version number? The electron gives back in main process, but the web...
    version = '1.0.0';
    autoUpdateSettings$: Observable<AutoUpdateSettings>;
    checkingForUpdate$: Observable<boolean>;

    constructor(private store: Store<AppState>) {
        this.autoUpdateSettings$ = store.select(getAutoUpdateSettings);
        this.checkingForUpdate$ = store.select(getCheckingForUpdate);
    }

    toogleCheckForUpdateOnStartUp(value: boolean) {
        this.store.dispatch(new ToggleCheckForUpdateOnStartupAction(value));
    }

    toogleUsePreReleaseUpdate(value: boolean) {
        this.store.dispatch(new TogglePreReleaseFlagAction(value));
    }

    checkForUpdate() {
        this.store.dispatch(new CheckForUpdateNowAction());
    }
}

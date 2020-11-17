import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { faCog } from '@fortawesome/free-solid-svg-icons';

import { AppTheme, AppThemeSelect } from 'uhk-common';
import {
    AppState,
    appUpdateSettingsState,
    getAnimationEnabled,
    getAppTheme,
    getOperatingSystem,
    getSupportedThemes
} from '../../../store';
import { State as UpdateSettingsState } from '../../../store/reducers/auto-update-settings';
import {
    CheckForUpdateNowAction,
    ToggleCheckForUpdateOnStartupAction
} from '../../../store/actions/auto-update-settings';
import { SetAppThemeAction, ToggleAnimationEnabledAction } from '../../../store/actions/app';
import { OperatingSystem } from '../../../models/operating-system';

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
    animationEnabled$: Observable<boolean>;
    appTheme$: Observable<AppTheme>;
    themes$: Observable<AppThemeSelect[]>;
    isLinux$: Observable<boolean>;
    faCog = faCog;

    constructor(private store: Store<AppState>) {
        this.updateSettingsState$ = store.select(appUpdateSettingsState);
        this.animationEnabled$ = store.select(getAnimationEnabled);
        this.appTheme$ = store.select(getAppTheme);
        this.themes$ = store.select(getSupportedThemes);
        this.isLinux$ = store.select(getOperatingSystem).pipe(map(os => os === OperatingSystem.Linux));
    }

    toggleCheckForUpdateOnStartUp(value: boolean) {
        this.store.dispatch(new ToggleCheckForUpdateOnStartupAction(value));
    }

    checkForUpdate(allowPrerelease: boolean): void {
        this.store.dispatch(new CheckForUpdateNowAction(allowPrerelease));
    }

    toggleAnimationEnabled(enabled: boolean): void {
        this.store.dispatch(new ToggleAnimationEnabledAction(enabled));
    }

    selectTheme(value: AppTheme) {
        this.store.dispatch(new SetAppThemeAction(value));
    }
}

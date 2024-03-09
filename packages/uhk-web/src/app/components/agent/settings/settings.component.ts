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
    getSupportedThemes,
    keyboardHalvesAlwaysJoined
} from '../../../store';
import { State as UpdateSettingsState } from '../../../store/reducers/auto-update-settings';
import {
    CheckForUpdateNowAction,
    ToggleCheckForUpdateOnStartupAction
} from '../../../store/actions/auto-update-settings';
import { OpenConfigFolderAction, SetAppThemeAction, ToggleAnimationEnabledAction, ToggleKeyboardHalvesAlwaysJoinedAction } from '../../../store/actions/app';
import { OperatingSystem } from '../../../models/operating-system';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    host: {
        'class': 'container-fluid d-block'
    }
})
export class SettingsComponent {
    updateSettingsState$: Observable<UpdateSettingsState>;
    animationEnabled$: Observable<boolean>;
    appTheme$: Observable<AppTheme>;
    themes$: Observable<AppThemeSelect[]>;
    isLinux$: Observable<boolean>;
    faCog = faCog;
    keyboardHalvesAlwaysJoined$: Observable<boolean>;

    constructor(private store: Store<AppState>) {
        this.updateSettingsState$ = store.select(appUpdateSettingsState);
        this.animationEnabled$ = store.select(getAnimationEnabled);
        this.appTheme$ = store.select(getAppTheme);
        this.themes$ = store.select(getSupportedThemes);
        this.isLinux$ = store.select(getOperatingSystem).pipe(map(os => os === OperatingSystem.Linux));
        this.keyboardHalvesAlwaysJoined$ = store.select(keyboardHalvesAlwaysJoined);
    }

    openConfigFolder(): void {
        this.store.dispatch(new OpenConfigFolderAction());
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

    toggleKeyboardHalvesAlwaysJoined(enabled: boolean): void {
        this.store.dispatch(new ToggleKeyboardHalvesAlwaysJoinedAction(enabled));
    }

}

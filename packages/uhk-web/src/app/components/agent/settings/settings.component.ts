import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { faCog } from '@fortawesome/free-solid-svg-icons';

import { AppTheme, AppThemeSelect, MacroGroupingSettings } from 'uhk-common';
import {
    AppState,
    appUpdateSettingsState,
    getAlwaysEnableAdvancedMode,
    getAnimationEnabled,
    getAppTheme,
    getIsAdvancedSettingsMenuVisible,
    getMacroGroupingSettings,
    getOperatingSystem,
    getSupportedThemes,
    keyboardHalvesAlwaysJoined
} from '../../../store';
import { MACRO_GROUPING_MAX_DEPTH } from '../../../util/group-macros-by-name';
import { State as UpdateSettingsState } from '../../../store/reducers/auto-update-settings';
import {
    CheckForUpdateNowAction,
    ToggleCheckForUpdateOnStartupAction
} from '../../../store/actions/auto-update-settings';
import { OpenConfigFolderAction, SetAppThemeAction, SetMacroGroupingSettingsAction, ToggleAnimationEnabledAction, ToggleKeyboardHalvesAlwaysJoinedAction } from '../../../store/actions/app';
import { ToggleAlwaysEnableAdvancedModeAction } from '../../../store/actions/advance-settings.action';
import { OperatingSystem } from '../../../models/operating-system';

@Component({
    selector: 'settings',
    standalone: false,
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
    alwaysEnableAdvancedMode$: Observable<boolean>;
    alwaysEnableAdvancedModeSettingVisible$: Observable<boolean>;
    macroGroupingSettings$: Observable<MacroGroupingSettings>;
    macroGroupingMaxDepth = MACRO_GROUPING_MAX_DEPTH;

    constructor(private store: Store<AppState>) {
        this.updateSettingsState$ = store.select(appUpdateSettingsState);
        this.animationEnabled$ = store.select(getAnimationEnabled);
        this.appTheme$ = store.select(getAppTheme);
        this.themes$ = store.select(getSupportedThemes);
        this.isLinux$ = store.select(getOperatingSystem).pipe(map(os => os === OperatingSystem.Linux));
        this.keyboardHalvesAlwaysJoined$ = store.select(keyboardHalvesAlwaysJoined);
        this.alwaysEnableAdvancedMode$ = store.select(getAlwaysEnableAdvancedMode);
        this.alwaysEnableAdvancedModeSettingVisible$ = store.select(getIsAdvancedSettingsMenuVisible);
        this.macroGroupingSettings$ = store.select(getMacroGroupingSettings);
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

    toggleAlwaysEnableAdvancedMode(enabled: boolean): void {
        this.store.dispatch(new ToggleAlwaysEnableAdvancedModeAction(enabled));
    }

    updateMacroGroupingSettings(settings: Partial<MacroGroupingSettings>): void {
        this.store.dispatch(new SetMacroGroupingSettingsAction(settings));
    }

}

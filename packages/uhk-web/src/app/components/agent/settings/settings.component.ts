import { Component, inject } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCog, faDesktop, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AppTheme, KEY_LANGUAGE_OPTIONS, KeyLanguage, MacroGroupingSettings } from 'uhk-common';
import {
    AppState,
    appUpdateSettingsState,
    getAlwaysEnableAdvancedMode,
    getAnimationEnabled,
    getAppTheme,
    getDetectSharedConfigurationChanges,
    getIsAdvancedSettingsMenuVisible,
    getKeyLanguage,
    getMacroGroupingSettings,
    getMinimizeToTray,
    getOperatingSystem,
    getSharedConfigurationFilePath,
    keyboardHalvesAlwaysJoined,
} from '../../../store';
import { MACRO_GROUPING_MAX_DEPTH } from '../../../util/group-macros-by-name';
import { State as UpdateSettingsState } from '../../../store/reducers/auto-update-settings';
import {
    CheckForUpdateNowAction,
    ToggleCheckForUpdateOnStartupAction
} from '../../../store/actions/auto-update-settings';
import {
    OpenConfigFolderAction,
    SetAppThemeAction,
    SetDetectSharedConfigurationChangesAction,
    SetKeyLanguageAction,
    SetMacroGroupingSettingsAction,
    SetSharedConfigurationFilePathAction,
    ToggleAnimationEnabledAction,
    ToggleKeyboardHalvesAlwaysJoinedAction,
    ToggleMinimizeToTrayAction,
} from '../../../store/actions/app';
import { ToggleAlwaysEnableAdvancedModeAction } from '../../../store/actions/advance-settings.action';
import { OperatingSystem } from '../../../models/operating-system';
import { FileDialogService } from '../../../services/file-dialog.service';

type ThemeOption = {
    id: AppTheme;
    text: string;
    icon: IconDefinition;
};

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
    minimizeToTray$: Observable<boolean>;
    appTheme$: Observable<AppTheme>;
    keyLanguage$: Observable<KeyLanguage>;
    isLinux$: Observable<boolean>;
    faCog = faCog;
    keyboardHalvesAlwaysJoined$: Observable<boolean>;
    alwaysEnableAdvancedMode$: Observable<boolean>;
    alwaysEnableAdvancedModeSettingVisible$: Observable<boolean>;
    macroGroupingSettings$: Observable<MacroGroupingSettings>;
    sharedConfigurationFilePath$: Observable<string | undefined>;
    hasSharedConfigurationFilePath$: Observable<boolean>;
    sharedConfigurationFile$: Observable<{ filePath: string; isDefault: boolean }>;
    detectSharedConfigurationChanges$: Observable<boolean>;
    macroGroupingMaxDepth = MACRO_GROUPING_MAX_DEPTH;
    keyLanguages = KEY_LANGUAGE_OPTIONS;
    themes: ThemeOption[] = [
        { id: AppTheme.System, text: 'Follow operating system theme', icon: faDesktop },
        { id: AppTheme.Light, text: 'Light', icon: faSun },
        { id: AppTheme.Dark, text: 'Dark', icon: faMoon },
    ];

    private readonly store = inject<Store<AppState>>(Store);
    private readonly fileDialogService = inject(FileDialogService);

    constructor() {
        this.updateSettingsState$ = this.store.select(appUpdateSettingsState);
        this.animationEnabled$ = this.store.select(getAnimationEnabled);
        this.minimizeToTray$ = this.store.select(getMinimizeToTray);
        this.appTheme$ = this.store.select(getAppTheme);
        this.keyLanguage$ = this.store.select(getKeyLanguage);
        this.isLinux$ = this.store.select(getOperatingSystem).pipe(map(os => os === OperatingSystem.Linux));
        this.keyboardHalvesAlwaysJoined$ = this.store.select(keyboardHalvesAlwaysJoined);
        this.alwaysEnableAdvancedMode$ = this.store.select(getAlwaysEnableAdvancedMode);
        this.alwaysEnableAdvancedModeSettingVisible$ = this.store.select(getIsAdvancedSettingsMenuVisible);
        this.macroGroupingSettings$ = this.store.select(getMacroGroupingSettings);
        this.sharedConfigurationFilePath$ = this.store.select(getSharedConfigurationFilePath);
        this.hasSharedConfigurationFilePath$ = this.sharedConfigurationFilePath$.pipe(map(filePath => !!filePath));
        this.sharedConfigurationFile$ = combineLatest([
            this.sharedConfigurationFilePath$,
            this.fileDialogService.getDefaultSharedConfigurationFilePath(),
        ]).pipe(
            map(([filePath, defaultFilePath]) => ({
                filePath: filePath || defaultFilePath,
                isDefault: !filePath,
            }))
        );
        this.detectSharedConfigurationChanges$ = this.store.select(getDetectSharedConfigurationChanges);
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

    selectKeyLanguage(value: KeyLanguage) {
        this.store.dispatch(new SetKeyLanguageAction(value));
    }

    toggleKeyboardHalvesAlwaysJoined(enabled: boolean): void {
        this.store.dispatch(new ToggleKeyboardHalvesAlwaysJoinedAction(enabled));
    }

    toggleMinimizeToTray(enabled: boolean): void {
        this.store.dispatch(new ToggleMinimizeToTrayAction(enabled));
    }

    toggleAlwaysEnableAdvancedMode(enabled: boolean): void {
        this.store.dispatch(new ToggleAlwaysEnableAdvancedModeAction(enabled));
    }

    updateMacroGroupingSettings(settings: Partial<MacroGroupingSettings>): void {
        this.store.dispatch(new SetMacroGroupingSettingsAction(settings));
    }

    chooseSharedConfigurationFile(): void {
        this.sharedConfigurationFilePath$.pipe(take(1))
            .subscribe(currentPath => {
                this.fileDialogService.selectSharedConfigurationFile(currentPath)
                    .subscribe(filePath => {
                        if (filePath) {
                            this.store.dispatch(new SetSharedConfigurationFilePathAction(filePath));
                        }
                    });
            });
    }

    useDefaultSharedConfigurationFilePath(): void {
        this.store.dispatch(new SetSharedConfigurationFilePathAction(undefined));
    }

    toggleDetectSharedConfigurationChanges(enabled: boolean): void {
        this.store.dispatch(new SetDetectSharedConfigurationChangesAction(enabled));
    }

}

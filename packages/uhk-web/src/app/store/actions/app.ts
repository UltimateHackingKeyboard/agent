import { Action } from '@ngrx/store';

import { ApplicationSettings, AppStartInfo, AppTheme, HardwareConfiguration, Notification } from 'uhk-common';
import { ElectronLogEntry } from '../../models/xterm-log';
import { NavigationPayload } from '../../models';

export enum ActionTypes {
    AppBootstrapped = '[app] bootstrapped',
    AppStarted = '[app] started',
    AppShowNotification = '[app] show notification',
    ApplyAppStartInfo = '[app] apply command line args',
    AppProcessStartInfo = '[app] process start info',
    ErrorPanelSizeChanged = '[app] errol panel size changed',
    UndoLast = '[app] undo last action',
    UndoLastSuccess = '[app] undo last action success',
    DismissUndoNotification = '[app] dismiss notification action',
    LoadHardwareConfigurationSuccess = '[app] load hardware configuration success',
    LoadApplicationSettings = '[app] Load application settings',
    LoadApplicationSettingsSuccess = '[app] Load application settings success',
    SaveApplicationSettingsSuccess = '[app] Save application settings success',
    ElectronMainLogReceived = '[app] Electron main log received',
    Empty = '[app] empty action',
    OpenConfigFolder = '[app] Open config folder',
    OpenUrlInNewWindow = '[app] Open URL in new Window',
    PrivilegeWhatWillThisDo = '[app] What will this do clicked',
    SetupPermissionError = '[app] Setup permission error',
    ToggleAnimationEnabled = '[app] Toggle animation enabled',
    ToggleKeyboardHalvesAlwaysJoined = '[app] Toggle keyboard halves always joined',
    SetAppTheme = '[app] Set application theme',
    LoadAppStartInfo = '[app] Load app start info',
    StartKeypressCapturing = '[app] Start keypress capturing',
    StopKeypressCapturing = '[app] Stop keypress capturing',
    KeyDown = '[app] Key down',
    KeyUp = '[app] Key up',
    NavigateTo = '[app] NavigateTo'
}

export class AppBootstrappedAction implements Action {
    type = ActionTypes.AppBootstrapped;
}

export class AppStartedAction implements Action {
    type = ActionTypes.AppStarted;
}

export class ErrorPanelSizeChangedAction implements Action {
    type = ActionTypes.ErrorPanelSizeChanged;

    constructor(public payload: number) {
    }
}

export class ShowNotificationAction implements Action {
    type = ActionTypes.AppShowNotification;

    constructor(public payload: Notification) {
    }
}

export class ApplyAppStartInfoAction implements Action {
    type = ActionTypes.ApplyAppStartInfo;

    constructor(public payload: AppStartInfo) {
    }
}

export class ProcessAppStartInfoAction implements Action {
    type = ActionTypes.AppProcessStartInfo;

    constructor(public payload: AppStartInfo) {
    }
}

export class UndoLastAction implements Action {
    type = ActionTypes.UndoLast;

    constructor(public payload: any) {
    }
}

export class UndoLastSuccessAction implements Action {
    type = ActionTypes.UndoLastSuccess;
}

export class DismissUndoNotificationAction implements Action {
    type = ActionTypes.DismissUndoNotification;
}

export class LoadHardwareConfigurationSuccessAction implements Action {
    type = ActionTypes.LoadHardwareConfigurationSuccess;

    constructor(public payload: HardwareConfiguration) {
    }
}

export class LoadApplicationSettingsAction implements Action {
    type = ActionTypes.LoadApplicationSettings;
}

export class LoadApplicationSettingsSuccessAction implements Action {
    type = ActionTypes.LoadApplicationSettingsSuccess;

    constructor(public payload: ApplicationSettings) {
    }
}

export class SaveApplicationSettingsSuccessAction implements Action {
    type = ActionTypes.SaveApplicationSettingsSuccess;
}

export class ElectronMainLogReceivedAction implements Action {
    type = ActionTypes.ElectronMainLogReceived;

    constructor(public payload: ElectronLogEntry) {
    }
}

export class EmptyAction implements Action {
    type = ActionTypes.Empty;
}

export class OpenConfigFolderAction implements Action {
    type = ActionTypes.OpenConfigFolder;
}

export class OpenUrlInNewWindowAction implements Action {
    type = ActionTypes.OpenUrlInNewWindow;

    constructor(public payload: string) {
    }
}

export class PrivilegeWhatWillThisDoAction implements Action {
    type = ActionTypes.PrivilegeWhatWillThisDo;
}

export class SetupPermissionErrorAction implements Action {
    type = ActionTypes.SetupPermissionError;

    constructor(public payload: string) {
    }
}

export class ToggleAnimationEnabledAction implements Action {
    type = ActionTypes.ToggleAnimationEnabled;

    constructor(public payload: boolean) {
    }
}

export class ToggleKeyboardHalvesAlwaysJoinedAction implements Action {
    type = ActionTypes.ToggleKeyboardHalvesAlwaysJoined;

    constructor(public payload: boolean) {
    }
}

export class SetAppThemeAction implements Action {
    type = ActionTypes.SetAppTheme;

    constructor(public payload: AppTheme) {
    }
}

export class LoadAppStartInfoAction implements Action {
    type = ActionTypes.LoadAppStartInfo;
}

export class StartKeypressCapturingAction implements Action {
    type = ActionTypes.StartKeypressCapturing;
}

export class StopKeypressCapturingAction implements Action {
    type = ActionTypes.StopKeypressCapturing;
}

export class KeyDownAction implements Action {
    readonly type = ActionTypes.KeyDown;

    constructor(public payload: KeyboardEvent) {}
}

export class KeyUpAction implements Action {
    readonly type = ActionTypes.KeyUp;

    constructor(public payload: KeyboardEvent) {}
}

export class NavigateTo implements Action {
    readonly type = ActionTypes.NavigateTo;

    constructor(public payload: NavigationPayload) {}
}

export type Actions
    = AppStartedAction
    | AppBootstrappedAction
    | ErrorPanelSizeChangedAction
    | ShowNotificationAction
    | ApplyAppStartInfoAction
    | ProcessAppStartInfoAction
    | UndoLastAction
    | UndoLastSuccessAction
    | DismissUndoNotificationAction
    | LoadHardwareConfigurationSuccessAction
    | LoadApplicationSettingsAction
    | LoadApplicationSettingsSuccessAction
    | SaveApplicationSettingsSuccessAction
    | ElectronMainLogReceivedAction
    | EmptyAction
    | OpenConfigFolderAction
    | OpenUrlInNewWindowAction
    | PrivilegeWhatWillThisDoAction
    | SetupPermissionErrorAction
    | ToggleAnimationEnabledAction
    | ToggleKeyboardHalvesAlwaysJoinedAction
    | SetAppThemeAction
    | LoadAppStartInfoAction
    | StartKeypressCapturingAction
    | StopKeypressCapturingAction
    | KeyDownAction
    | KeyUpAction
    | NavigateTo
    ;

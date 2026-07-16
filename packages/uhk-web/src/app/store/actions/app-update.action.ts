import { Action } from '@ngrx/store';

import { UpdateInfo } from '../../models/update-info';

export enum ActionTypes {
    ForceUpdate = '[app-update] force update',
    InvalidCodesignSignature = '[app-update] invalid codesign signature',
    UpdateAvailable = '[app-update] update available',
    UpdateApp = '[app-update] update app',
    DoNotUpdateApp = '[app-update] do not update app',
    UpdateDownloaded = '[app-update] update downloaded',
    Updating = '[app-update] updating',
    UpdateError = '[app-update] error',
    ResetUpdateDismiss = '[app-update] reset update dismiss',
    ClearUpdateAvailability = '[app-update] clear update availability',
}

export class ForceUpdateAction implements Action {
    type = ActionTypes.ForceUpdate;
}

export class InvalidCodesignSignatureAction implements Action {
    type = ActionTypes.InvalidCodesignSignature;
}

export class UpdateAvailableAction implements Action {
    type = ActionTypes.UpdateAvailable;

    constructor(public payload: UpdateInfo) {
    }
}

export class UpdateAppAction implements Action {
    type = ActionTypes.UpdateApp;
}

export class DoNotUpdateAppAction implements Action {
    type = ActionTypes.DoNotUpdateApp;
}

export class ResetUpdateDismissAction implements Action {
    type = ActionTypes.ResetUpdateDismiss;
}

export class ClearUpdateAvailabilityAction implements Action {
    type = ActionTypes.ClearUpdateAvailability;
}

export class UpdateDownloadedAction implements Action {
    type = ActionTypes.UpdateDownloaded;

    constructor(public payload: UpdateInfo) {
    }
}

export class UpdatingAction implements Action {
    type = ActionTypes.Updating;
}

export class UpdateErrorAction implements Action {
    type = ActionTypes.UpdateError;

    constructor(public payload: unknown) {
    }
}

export type Actions
    = ForceUpdateAction
    | UpdateAvailableAction
    | InvalidCodesignSignatureAction
    | UpdateAppAction
    | DoNotUpdateAppAction
    | ResetUpdateDismissAction
    | ClearUpdateAvailabilityAction
    | UpdateDownloadedAction
    | UpdatingAction
    | UpdateErrorAction;

import { Action } from '@ngrx/store';

import { UpdateInfo } from '../../models/update-info';

export enum ActionTypes {
    UpdateAvailable = '[app-update] update available',
    UpdateApp = '[app-update] update app',
    DoNotUpdateApp = '[app-update] do not update app',
    UpdateDownloaded = '[app-update] update downloaded',
    Updating = '[app-update] updating',
    UpdateError = '[app-update] error'
}

export class UpdateAvailableAction implements Action {
    type = ActionTypes.UpdateAvailable;
}

export class UpdateAppAction implements Action {
    type = ActionTypes.UpdateApp;
}

export class DoNotUpdateAppAction implements Action {
    type = ActionTypes.DoNotUpdateApp;
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

    constructor(public payload: any) {
    }
}

export type Actions
    = UpdateAvailableAction
    | UpdateAppAction
    | DoNotUpdateAppAction
    | UpdateDownloadedAction
    | UpdatingAction
    | UpdateErrorAction;

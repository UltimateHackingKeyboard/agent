import { Action } from '@ngrx/store';
import { type } from 'uhk-common';

const PREFIX = '[app-update] ';

// tslint:disable-next-line:variable-name
export const ActionTypes = {
    UPDATE_AVAILABLE: type(PREFIX + 'update available'),
    UPDATE_APP: type(PREFIX + 'update app'),
    DO_NOT_UPDATE_APP: type(PREFIX + 'do not update app'),
    UPDATE_DOWNLOADED: type(PREFIX + 'update downloaded'),
    UPDATING: type(PREFIX + 'updating'),
    UPDATE_ERROR: type(PREFIX + 'error'),
};

export class UpdateAvailableAction implements Action {
    type = ActionTypes.UPDATE_AVAILABLE;
}

export class UpdateAppAction implements Action {
    type = ActionTypes.UPDATE_APP;
}

export class DoNotUpdateAppAction implements Action {
    type = ActionTypes.DO_NOT_UPDATE_APP;
}

export class UpdateDownloadedAction implements Action {
    type = ActionTypes.UPDATE_DOWNLOADED;
}

export class UpdatingAction implements Action {
    type = ActionTypes.UPDATING;
}

export class UpdateErrorAction implements Action {
    type = ActionTypes.UPDATE_ERROR;

    constructor(public payload: any) {}
}

export type Actions =
    | UpdateAvailableAction
    | UpdateAppAction
    | DoNotUpdateAppAction
    | UpdateDownloadedAction
    | UpdatingAction
    | UpdateErrorAction;

import { Action } from '@ngrx/store';
import { type } from '../../shared/util/';

const PREFIX = '[app-update] ';

// tslint:disable-next-line:variable-name
export const ActionTypes = {
    UPDATE_AVAILABLE: type(PREFIX + 'update available'),
    UPDATE_APP: type(PREFIX + 'update app'),
    DO_NOT_UPDATE_APP: type(PREFIX + 'do not update app'),
    UPDATE_DOWNLOADED: type(PREFIX + 'update downloaded'),
    UPDATEING: type(PREFIX + 'updating')
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
    type = ActionTypes.UPDATEING;
}

export type Actions
    = UpdateAvailableAction
    | UpdateAppAction
    | DoNotUpdateAppAction
    | UpdateDownloadedAction
    | UpdatingAction;

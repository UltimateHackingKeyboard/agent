import { Action } from '@ngrx/store';

import { type } from '../../util';
import { UserConfiguration } from '../../config-serializer/config-items/UserConfiguration';

const PREFIX = '[user-config] ';

// tslint:disable-next-line:variable-name
export const ActionTypes = {
    LOAD_USER_CONFIG: type(PREFIX + 'Load User Config'),
    LOAD_USER_CONFIG_SUCCESS: type(PREFIX + 'Load User Config Success')
};

export class LoadUserConfigAction implements Action {
    type = ActionTypes.LOAD_USER_CONFIG;
}

export class LoadUserConfigSuccessAction implements Action {
    type = ActionTypes.LOAD_USER_CONFIG_SUCCESS;

    constructor(public payload: UserConfiguration) {

    }
}

export type Actions
    = LoadUserConfigAction
    | LoadUserConfigSuccessAction;

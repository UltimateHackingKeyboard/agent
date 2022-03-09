import { Action } from '@ngrx/store';
import { UserConfiguration } from 'uhk-common';

import { LayerOption } from '../../models';

export enum ActionTypes {
    AddKeymapSelected = '[default-user-config] add keymap selected',
    LoadDefaultUserConfiguration = '[default-user-config] load',
    LoadDefaultUserConfigurationSuccess = '[default-user-config] load success',
    SelectLayer = '[default-user-config] select layer'
}

export class AddKeymapSelectedAction implements Action {
    type = ActionTypes.AddKeymapSelected;

    /**
     * @param payload - selected keymap abbreviation
     */
    constructor(public payload: string) {
    }
}

export class LoadDefaultUserConfigurationAction implements Action {
    type = ActionTypes.LoadDefaultUserConfiguration;
}

export class LoadDefaultUserConfigurationSuccessAction implements Action {
    type = ActionTypes.LoadDefaultUserConfigurationSuccess;

    constructor(public payload: UserConfiguration) {
    }
}

export class SelectLayerAction implements Action {
    type = ActionTypes.SelectLayer;

    constructor(public payload: LayerOption) {
    }
}

export type Actions =
    AddKeymapSelectedAction
    | LoadDefaultUserConfigurationAction
    | LoadDefaultUserConfigurationSuccessAction
    | SelectLayerAction
    ;

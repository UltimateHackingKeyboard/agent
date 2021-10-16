import { Action } from '@ngrx/store';
import { UserConfiguration } from 'uhk-common';

export enum ActionTypes {
    AddKeymapSelected = '[default-user-config] add keymap selected',
    LoadDefaultUserConfiguration = '[default-user-config] load',
    LoadDefaultUserConfigurationSuccess = '[default-user-config] load success'
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

export type Actions =
    AddKeymapSelectedAction
    | LoadDefaultUserConfigurationAction
    | LoadDefaultUserConfigurationSuccessAction
    ;

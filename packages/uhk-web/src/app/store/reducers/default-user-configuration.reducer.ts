import { Keymap, UserConfiguration } from 'uhk-common';
import {
    Actions,
    ActionTypes,
    AddKeymapSelectedAction,
    LoadDefaultUserConfigurationSuccessAction
} from '../actions/default-user-configuration.actions';

export interface State {
    loading: boolean;
    userConfiguration?: UserConfiguration;
    selectedKeymapAbbreviation?: string;
}

export const initialState: State = {
    loading: false
};

export function reducer(state = initialState, action: Actions) {
    switch (action.type) {
        case ActionTypes.AddKeymapSelected:
            return {
                ...state,
                selectedKeymapAbbreviation: (action as AddKeymapSelectedAction).payload
            };

        case ActionTypes.LoadDefaultUserConfiguration:
            return {
                ...state,
                loading: true
            };

        case ActionTypes.LoadDefaultUserConfigurationSuccess:
            return {
                ...state,
                loading: false,
                userConfiguration: (action as LoadDefaultUserConfigurationSuccessAction).payload
            };

        default:
            return state;
    }
}

export const getDefaultUserConfigurationKeymaps = (state: State): Array<Keymap> => state.userConfiguration?.keymaps || [];
export const getSelectedKeymap = (state: State): Keymap => getDefaultUserConfigurationKeymaps(state)
    .find(keymap => keymap.abbreviation === state.selectedKeymapAbbreviation) || new Keymap();

import { getEmptyKeymap, Keymap, UserConfiguration } from 'uhk-common';

import { setSvgKeyboardCoverColorsOfAllLayer } from '../../util';
import * as AppActions from '../actions/app';
import {
    Actions,
    ActionTypes,
    AddKeymapSelectedAction,
    LoadDefaultUserConfigurationSuccessAction,
    SelectLayerAction
} from '../actions/default-user-configuration.actions';
import { LayerOption } from '../../models';
import { getBaseLayerOption, initLayerOptions } from './layer-options';
import { calculateLayerOptionsOfKeymap } from './calculate-layer-options-of-keymap';

export interface State {
    layerOptions: Map<number, LayerOption>;
    loading: boolean;
    userConfiguration?: UserConfiguration;
    selectedKeymapAbbreviation?: string;
    selectedLayerOption: LayerOption;
    theme: string;
}

export const initialState: State = {
    layerOptions: initLayerOptions(),
    loading: false,
    selectedLayerOption: getBaseLayerOption(),
    theme: ''
};

export function reducer(state = initialState, action: Actions | AppActions.Actions) {
    switch (action.type) {

        case AppActions.ActionTypes.SetAppTheme: {
            const theme = (action as AppActions.SetAppThemeAction).payload;
            const userConfiguration = state.userConfiguration.clone();
            setSvgKeyboardCoverColorsOfAllLayer(userConfiguration, theme);

            return {
                ...state,
                userConfiguration,
                theme
            };
        }

        case ActionTypes.AddKeymapSelected: {
            const newState = {
                ...state,
                selectedKeymapAbbreviation: (action as AddKeymapSelectedAction).payload
            };
            newState.layerOptions = calculateLayerOptions(newState);
            const currentLayerOption = newState.layerOptions.get(newState.selectedLayerOption.id);

            if (!currentLayerOption.selected) {
                newState.selectedLayerOption = getBaseLayerOption();
            }

            return newState;
        }

        case ActionTypes.LoadDefaultUserConfiguration:
            return {
                ...state,
                loading: true
            };

        case ActionTypes.LoadDefaultUserConfigurationSuccess: {
            const newState = {
                ...state,
                loading: false,
                userConfiguration: (action as LoadDefaultUserConfigurationSuccessAction).payload.clone()
            };
            newState.layerOptions = calculateLayerOptions(newState);
            setSvgKeyboardCoverColorsOfAllLayer(newState.userConfiguration, state.theme);

            return newState;
        }

        case ActionTypes.SelectLayer:
            return {
                ...state,
                selectedLayerOption: (action as SelectLayerAction).payload
            };

        default:
            return state;
    }
}

export const getDefaultUserConfiguration = (state: State): UserConfiguration => state.userConfiguration || new UserConfiguration();
export const getDefaultUserConfigurationKeymaps = (state: State): Array<Keymap> => getDefaultUserConfiguration(state).keymaps;
export const selectedKeymapAbbreviation = (state: State): string => state.selectedKeymapAbbreviation;
export const getSelectedKeymap = (state: State): Keymap => getDefaultUserConfigurationKeymaps(state)
    .find(keymap => keymap.abbreviation === state.selectedKeymapAbbreviation) || getEmptyKeymap();
export const getLayerOptions = (state: State): LayerOption[] => Array
    .from(state.layerOptions.values())
    .sort((a, b) => a.order - b.order);
export const getSelectedLayerOption = (state: State): LayerOption => state.selectedLayerOption;

function calculateLayerOptions(state: State): Map<number, LayerOption> {
    const selectedKeymap = getSelectedKeymap(state);

    return calculateLayerOptionsOfKeymap(selectedKeymap);
}

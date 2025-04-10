import { FirmwareRepoInfo } from 'uhk-common';

import * as fromApp from '../actions/app';
import {
    ActionTypes,
    DownloadDocumentationSuccessAction,
    PanelSizeChangedAction,
    SmartMacroDocActions
} from '../actions/smart-macro-doc.action';

const DEFAULT_PANEL_SIZE = 41;

export enum FirmwareDocState {
    Error = 'Error',
    Loading = 'Loading',
    Loaded = 'Loaded',
    Unknown = 'Unknown'
}

export interface State {
    firmwareDocState: FirmwareDocState;
    firmwareDocRepoInfo: FirmwareRepoInfo;
    panelSize: number;
    panelVisible: boolean;
    port?: number;
}

export const initialState: State = {
    firmwareDocState: FirmwareDocState.Unknown,
    firmwareDocRepoInfo: {
        firmwareGitRepo: '',
        firmwareGitTag: '',
    },
    panelSize: DEFAULT_PANEL_SIZE,
    panelVisible: false
};

export function reducer(state = initialState, action: SmartMacroDocActions | fromApp.Actions): State {
    switch (action.type) {

        case fromApp.ActionTypes.LoadApplicationSettingsSuccess:
            return {
                ...state,
                panelSize: (action as fromApp.LoadApplicationSettingsSuccessAction).payload.smartMacroPanelWidth || DEFAULT_PANEL_SIZE
            };

        case ActionTypes.DownloadDocumentation:
            return {
                ...state,
                firmwareDocState: FirmwareDocState.Loading
            };

        case ActionTypes.DownloadDocumentationSuccess:
            return {
                ...state,
                firmwareDocState: FirmwareDocState.Loaded,
                firmwareDocRepoInfo: (action as DownloadDocumentationSuccessAction).payload,
            };

        case ActionTypes.PanelSizeChanged:
            return {
                ...state,
                panelSize: (action as PanelSizeChangedAction).payload
            };

        case ActionTypes.ServiceListening:
            return {
                ...state,
                port: (action as PanelSizeChangedAction).payload
            };

        case ActionTypes.TogglePanelVisibility:
            return {
                ...state,
                panelVisible: !state.panelVisible
            };

        default:
            return state;
    }
}

export const getSmartMacroPanelWidth = (state: State): number => state.panelSize;
export const getSmartMacroPanelVisibility = (state: State): boolean => state.panelVisible;

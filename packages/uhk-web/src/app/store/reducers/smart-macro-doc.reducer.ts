import * as fromApp from '../actions/app';
import {
    ActionTypes,
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
    panelSize: number;
    panelVisible: boolean;
    port?: number;
}

export const initialState: State = {
    firmwareDocState: FirmwareDocState.Unknown,
    panelSize: DEFAULT_PANEL_SIZE,
    panelVisible: false
};

export function reducer(state = initialState, action: SmartMacroDocActions | fromApp.Actions) {
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
                firmwareDocState: FirmwareDocState.Loaded
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

export const getSmartMacroDocUrl = (state: State): string => {
    if (state.firmwareDocState === FirmwareDocState.Loaded)
        return `http://127.0.0.1:${state.port}/index.html`;

    return `http://127.0.0.1:${state.port}/loading.html`;
};
export const getSmartMacroPanelWidth = (state: State): number => state.panelSize;
export const getSmartMacroPanelVisibility = (state: State): boolean => state.panelVisible;

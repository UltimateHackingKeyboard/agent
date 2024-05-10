import { Action } from "@ngrx/store";

export enum ActionTypes {
    DownloadDocumentation = '[smart-macro-doc] download documentation',
    DownloadDocumentationSuccess = '[smart-macro-doc] download documentation success',
    DownloadDocumentationFailed = '[smart-macro-doc] download documentation failed',
    PanelSizeChanged = '[smart-macro-doc] panel size changed',
    ReferenceManualChanged = '[smart-macro-doc] reference manual changed',
    ServiceListening = '[smart-macro-doc] service listening',
    SmdInited = '[smart-macro-doc][smd] inited',
    TogglePanelVisibility = '[smart-macro-doc] toggle panel visibility',
}

export class DownloadDocumentationAction implements Action {
    type = ActionTypes.DownloadDocumentation;
}

export class DownloadDocumentationSuccessAction implements Action {
    type = ActionTypes.DownloadDocumentationSuccess;
}

export class PanelSizeChangedAction implements Action {
    type = ActionTypes.PanelSizeChanged;

    constructor(public payload: number) {}
}

export class ReferenceManualChangedAction implements Action {
    type = ActionTypes.ReferenceManualChanged;

    constructor(public payload: string) {}
}

export class ServiceListeningAction implements Action {
    type = ActionTypes.ServiceListening;

    constructor(public payload: number) {}
}

export class SmdInitedAction implements Action {
    type = ActionTypes.SmdInited;
}

export class TogglePanelVisibilityAction implements Action {
    type = ActionTypes.TogglePanelVisibility;
}

export type SmartMacroDocActions
    = DownloadDocumentationAction
    | DownloadDocumentationSuccessAction
    | ReferenceManualChangedAction
    | PanelSizeChangedAction
    | ServiceListeningAction
    | SmdInitedAction
    | TogglePanelVisibilityAction
;

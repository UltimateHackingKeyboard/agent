export interface HistoryFileInfo {
    file: string;
    showRestore: boolean;
}

export interface UserConfigHistoryComponentState {
    files: Array<HistoryFileInfo>;
    loading: boolean;
    disabled: boolean;
}

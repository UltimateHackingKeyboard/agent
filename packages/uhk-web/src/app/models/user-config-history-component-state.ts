export interface HistoryFileInfo {
    /**
     * The filename of the saved user configuration
     */
    file: string;
    /**
     * Text that will show in the 2nd column as
     *   - Current
     *   - Same as current
     *   - Restore
     */
    displayText: string;
    showRestore: boolean;
    /**
     * The timestamp of the saved user configuration
     */
    timestamp: string;
}

export interface Tab {
    displayText: string;
    files: HistoryFileInfo[];
}

export interface UserConfigHistoryComponentState {
    commonFiles: HistoryFileInfo[];
    tabs: Tab[];
    loading: boolean;
    disabled: boolean;
}

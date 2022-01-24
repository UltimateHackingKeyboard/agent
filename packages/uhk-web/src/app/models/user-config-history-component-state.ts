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
}

export interface UserConfigHistoryComponentState {
    files: Array<HistoryFileInfo>;
    loading: boolean;
    disabled: boolean;
}

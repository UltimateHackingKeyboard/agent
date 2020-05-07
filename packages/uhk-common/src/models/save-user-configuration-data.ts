export interface SaveUserConfigurationData {
    uniqueId: number;
    configuration: string;
    saveInHistory: boolean;
    /**
     * Navigate to the default keymap after the configuration saved.
     * - true => navigate
     * - false => staying on the current page
     */
    navigateToKeymap?: boolean;
}

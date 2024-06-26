export interface SaveUserConfigurationData {
    /**
     * UHK device product id.
     */
    deviceId: number;
    /**
     * The unique identifier of the UHK keyboard.
     */
    uniqueId: number;
    configuration: string;
    saveInHistory: boolean;
}

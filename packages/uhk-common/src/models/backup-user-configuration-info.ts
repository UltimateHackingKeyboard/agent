export enum BackupUserConfigurationInfo {
    /**
     * The last saved backup user configuration is compatible with the current firmware version of the UHK
     */
    LastCompatible = 'LatestCompatible',
    /**
     * The last saved backup user configuration is not compatible with the current firmware version of the UHK,
     * but we found earlier version that compatible
     */
    EarlierCompatible = 'EarlierCompatible',
    /**
     * There is no saved user configuration on this computer
     */
    NotExists = 'NotExists',
    /**
     * There is no information about the backup user configuration
     */
    Unknown = 'Unknown',
}

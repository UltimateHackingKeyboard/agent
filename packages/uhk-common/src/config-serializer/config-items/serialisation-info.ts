/**
 * It is a proxy interface to prevent circular references
 * when we provide the UserConfiguration to other user config items.
 */
export interface SerialisationInfo {
    isUserConfigContainsRgbColors: boolean;
    userConfigMajorVersion: number;
    userConfigMinorVersion: number;
}

export const DEFAULT_SERIALISATION_INFO: SerialisationInfo = {
    isUserConfigContainsRgbColors: false,
    userConfigMajorVersion: 6,
    userConfigMinorVersion: 0,
};

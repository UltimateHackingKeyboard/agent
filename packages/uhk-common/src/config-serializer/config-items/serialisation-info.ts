import { isVersionGte, isVersionLt } from '../../util/version-helpers.js'

/**
 * It is a proxy interface to prevent circular references
 * when we provide the UserConfiguration to other user config items.
 */
export interface SerialisationInfo {
    isUserConfigContainsRgbColors: boolean;
    userConfigMajorVersion: number;
    userConfigMinorVersion: number;
    userConfigPatchVersion: number;
}

export const DEFAULT_SERIALISATION_INFO: SerialisationInfo = {
    isUserConfigContainsRgbColors: false,
    userConfigMajorVersion: 6,
    userConfigMinorVersion: 0,
    userConfigPatchVersion: 0,
};

export function isSerialisationInfoGte(serialisationInfo: SerialisationInfo, expected: string): boolean {
    const actual = `${serialisationInfo.userConfigMajorVersion}.${serialisationInfo.userConfigMinorVersion}.${serialisationInfo.userConfigPatchVersion}`;

    return isVersionGte(actual, expected);
}

export function isSerialisationInfoLt(serialisationInfo: SerialisationInfo, expected: string): boolean {
    const actual = `${serialisationInfo.userConfigMajorVersion}.${serialisationInfo.userConfigMinorVersion}.${serialisationInfo.userConfigPatchVersion}`;

    return isVersionLt(actual, expected);
}

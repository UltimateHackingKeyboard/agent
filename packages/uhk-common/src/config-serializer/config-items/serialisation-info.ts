import { gte, lt } from 'semver'

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

    return gte(actual, expected);
}

export function isSerialisationInfoLt(serialisationInfo: SerialisationInfo, expected: string): boolean {
    const actual = `${serialisationInfo.userConfigMajorVersion}.${serialisationInfo.userConfigMinorVersion}.${serialisationInfo.userConfigPatchVersion}`;

    return lt(actual, expected);
}

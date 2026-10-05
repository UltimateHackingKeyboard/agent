import { isVersionGt } from './version-helpers.js';

/**
 * Returns true when the user configuration version is higher than what the firmware supports
 * (firmwareBuiltUserconfig / rightHalf.userConfigVersion).
 */
export function isUserConfigVersionHigherThanFirmware(
    userConfigVersion: string,
    firmwareUserConfigVersion: string | undefined,
): boolean {
    return Boolean(
        userConfigVersion
        && firmwareUserConfigVersion
        && isVersionGt(userConfigVersion, firmwareUserConfigVersion),
    );
}

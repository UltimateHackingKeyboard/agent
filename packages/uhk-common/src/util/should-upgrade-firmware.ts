import { isVersionGt } from './version-helpers.js';
import { VERSIONS } from './versions.js';

/**
 * Returns true if have to upgrade the firmware before the user could save user configuration
 */
export function shouldUpgradeFirmware(userConfigVersion: string): boolean {
    return userConfigVersion
        && isVersionGt(VERSIONS.userConfigVersion, userConfigVersion);
}

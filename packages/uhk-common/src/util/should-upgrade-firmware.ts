import semver from 'semver';

import { VERSIONS } from './versions.js';

/**
 * Returns true if have to upgrade the firmware before the user could save user configuration
 */
export function shouldUpgradeFirmware(userConfigVersion: string): boolean {
    return userConfigVersion
        && semver.gt(VERSIONS.userConfigVersion, userConfigVersion);
}

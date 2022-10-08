import semver from 'semver';

import { VersionInformation } from '../models/index.js';

/**
 * Returns true if have to upgrade the firmware before the user could use the Agent
 */
export function shouldUpgradeFirmware(userConfigVersion: string, versions: VersionInformation): boolean {
    return userConfigVersion
        && semver.gt(versions.userConfigVersion, userConfigVersion);
}

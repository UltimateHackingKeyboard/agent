import { VersionInformation } from '../models/index.js';

import { isVersionGtMinor } from './is-version-gt-minor.js';

export function shouldUpgradeAgent(userConfigVersion: string, disableUpdateAgentProtection: boolean, versions: VersionInformation): boolean {
    return !disableUpdateAgentProtection
        && userConfigVersion
        && isVersionGtMinor(userConfigVersion, versions.userConfigVersion);
}

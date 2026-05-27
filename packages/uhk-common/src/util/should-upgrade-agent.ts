import { isVersionGtMinor } from './version-helpers.js';
import { VERSIONS } from './versions.js';

export function shouldUpgradeAgent(newUserConfigVersion: string, disableUpdateAgentProtection: boolean): boolean {
    return !disableUpdateAgentProtection
        && newUserConfigVersion
        && isVersionGtMinor(newUserConfigVersion, VERSIONS.userConfigVersion);
}

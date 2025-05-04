import { isVersionGtMinor } from './is-version-gt-minor.js';
import { VERSIONS } from './versions.js';

export function shouldUpgradeAgent(newUserConfigVersion: string, disableUpdateAgentProtection: boolean): boolean {
    return !disableUpdateAgentProtection
        && newUserConfigVersion
        && isVersionGtMinor(newUserConfigVersion, VERSIONS.userConfigVersion);
}

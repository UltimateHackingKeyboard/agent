import { isVersionGtMinor } from './is-version-gt-minor.js';

export function shouldUpgradeAgent(newUserConfigVersion: string, disableUpdateAgentProtection: boolean, agentUserConfigVersion: string): boolean {
    return !disableUpdateAgentProtection
        && newUserConfigVersion
        && agentUserConfigVersion
        && isVersionGtMinor(newUserConfigVersion, agentUserConfigVersion);
}

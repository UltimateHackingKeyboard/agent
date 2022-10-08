import { CommandLineArgs } from '../models/index.js';

export function disableAgentUpgradeProtection(options: CommandLineArgs): boolean {
    return Boolean(options['disable-agent-update-protection']);
}

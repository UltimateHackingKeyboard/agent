import { CommandLineArgs } from '../models/index.js';

export function simulateInvalidUserConfigError(options: CommandLineArgs): boolean {
    return options['error-simulation'] === 'invalid-user-config';
}

import { UserConfiguration } from '../config-serializer/config-items/user-configuration.js';

export function logUserConfigHelper(logger: Function, message: string, config: UserConfiguration | string): void {
    if (typeof config === 'string' || !config.toJsonObject) {
        config = new UserConfiguration().fromJsonObject(config);
    }

    logger(message, JSON.stringify(config.toJsonObject(), null, 2));
}

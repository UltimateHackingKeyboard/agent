import { UserConfiguration } from '../config-serializer/config-items/user-configuration.js';

export function logUserConfigHelper(logger: Function, message: string, config: UserConfiguration | string | Object): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof config === 'string' || !(config as any).toJsonObject) {
        config = new UserConfiguration().fromJsonObject(config);
    }

    logger(message, JSON.stringify((config as UserConfiguration).toJsonObject(), null, 2));
}

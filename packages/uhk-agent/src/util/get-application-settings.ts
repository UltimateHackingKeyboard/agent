import settings from 'electron-settings';

import { ApplicationSettings } from 'uhk-common';

const APPLICATION_SETTINGS_KEY = 'application-settings';

export async function getApplicationSettingsFromStorage(): Promise<ApplicationSettings> {
    const value = await settings.get(APPLICATION_SETTINGS_KEY);
    if (!value) {
        return {
            checkForUpdateOnStartUp: true,
            everAttemptedSavingToKeyboard: false,
        };
    }

    return JSON.parse(value as string);
}

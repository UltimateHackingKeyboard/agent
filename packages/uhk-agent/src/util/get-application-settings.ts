import settings from 'electron-settings';
import { ApplicationSettings } from 'uhk-common';

/**
 * Read the application settings from the same storage where the renderer saves them.
 */
export async function getApplicationSettings(): Promise<ApplicationSettings> {
    const value = await settings.get('application-settings');

    if (!value) {
        return {
            checkForUpdateOnStartUp: true,
            everAttemptedSavingToKeyboard: false,
        };
    }

    return JSON.parse(<string>value);
}

import { nativeTheme } from 'electron';
import settings from 'electron-settings';

export const DARK_WINDOW_BACKGROUND_COLOR = '#111';

export async function getWindowBackgroundColor(): Promise<string> {
    const { appTheme = 'system' } = JSON.parse(await settings.get('application-settings') as string || '{}');

    switch (appTheme) {
        case 'dark':
            return DARK_WINDOW_BACKGROUND_COLOR;

        case 'light':
            return 'white';

        default: {
            if (nativeTheme.shouldUseDarkColors) {
                return DARK_WINDOW_BACKGROUND_COLOR;
            }

            return 'white';
        }
    }
}

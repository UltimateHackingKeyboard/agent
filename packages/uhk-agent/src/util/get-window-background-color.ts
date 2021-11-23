import { nativeTheme } from 'electron';
import settings from 'electron-settings';

export async function getWindowBackgroundColor(): Promise<string> {
    const { appTheme = 'system' } = JSON.parse(await settings.get('application-settings') as string || '{}');

    switch (appTheme) {
        case 'dark':
            return '#111';

        case 'light':
            return 'white';

        default: {
            if (nativeTheme.shouldUseDarkColors) {
                return '#111';
            }

            return 'white';
        }
    }
}

import { nativeTheme } from 'electron';
import settings from 'electron-settings';

export function getWindowBackgroundColor(): string {
    const { appTheme = 'system' } = JSON.parse(settings.get('application-settings') as string || '{}');

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

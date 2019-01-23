import * as electron from 'electron';
import * as settings from 'electron-settings';

import { logger } from '../services/logger.service';
import { WindowState } from '../models/window-state';

const WINDOWS_SETTINGS_KEY = 'windowSettings';

export const windowVisibleFilter = (state: WindowState) => {
    return (display: electron.Display): boolean => (
        state.x >= display.bounds.x &&
        state.y >= display.bounds.y &&
        state.x <= display.bounds.width &&
        state.y <= display.bounds.height
    );
};

export const windowVisibleOnScreen = (state: WindowState): boolean => {
    return electron.screen.getAllDisplays().some(windowVisibleFilter(state));
};

export const getDefaultWindowState = () => ({
    width: 1024,
    height: 768,
    isMaximized: true
});

export const loadWindowState = (): Partial<WindowState> => {
    logger.log('[WindowState] load settings');
    try {
        const loadedState = settings.get(WINDOWS_SETTINGS_KEY) as any;
        logger.log('[WindowState] loaded settings', loadedState);

        if (!loadedState) {
            logger.log('[WindowState]save state not exists, use default');

            return getDefaultWindowState();
        }

        const visible = windowVisibleOnScreen(loadedState);
        logger.log('[WindowState] loaded settings is visible', visible);

        if (visible) {
            logger.log('[WindowState] return with loaded settings');
            return loadedState;
        }
    } catch (err) {
        logger.error('[WindowState] error when parsing loaded settings', err);
    }

    logger.log('[WindowState] return with default settings');

    return getDefaultWindowState();
};

export const saveWindowState = (win: electron.BrowserWindow) => {
    const winBounds = win.isMaximized() || win.isFullScreen()
        ? loadWindowState() as any
        : win.getBounds();

    const state: WindowState = {
        ...winBounds,
        isMaximized: win.isMaximized(),
        isFullScreen: win.isFullScreen()
    };

    logger.log('[WindowState] save settings:', state);
    settings.set(WINDOWS_SETTINGS_KEY, state as any);
    logger.log('[WindowState] save settings success');
};

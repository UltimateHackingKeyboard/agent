import * as electron from 'electron';
import settings from 'electron-settings';
import { LogService } from 'uhk-common';

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

export const loadWindowState = (logger: LogService): Partial<WindowState> => {
    logger.misc('[WindowState] load settings');
    try {
        const loadedState = settings.getSync(WINDOWS_SETTINGS_KEY) as any;
        logger.misc('[WindowState] loaded settings', loadedState);

        if (!loadedState) {
            logger.misc('[WindowState]save state not exists, use default');

            return getDefaultWindowState();
        }

        loadedState.width = loadedState.width < 1024 ? 1024 : loadedState.width;
        loadedState.height = loadedState.height < 768 ? 768 : loadedState.height;

        const visible = windowVisibleOnScreen(loadedState);
        logger.misc('[WindowState] loaded settings is visible', visible);

        if (visible) {
            logger.misc('[WindowState] return with loaded settings');
            return loadedState;
        }
    } catch (err) {
        logger.error('[WindowState] error when parsing loaded settings', err);
    }

    logger.misc('[WindowState] return with default settings');

    return getDefaultWindowState();
};

export const saveWindowState = (win: electron.BrowserWindow, logger: LogService) => {
    const winBounds = win.isMaximized() || win.isFullScreen()
        ? loadWindowState(logger) as any
        : win.getBounds();

    const state: WindowState = {
        ...winBounds,
        isMaximized: win.isMaximized(),
        isFullScreen: win.isFullScreen()
    };

    logger.misc('[WindowState] save settings:', state);
    settings.setSync(WINDOWS_SETTINGS_KEY, state as any);
    logger.misc('[WindowState] save settings success');
};

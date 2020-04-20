import { app, BrowserWindow, Menu, MenuItemConstructorOptions, systemPreferences } from 'electron';
import isDev from 'electron-is-dev';

export const setMenu = (win: BrowserWindow): void => {
    if (process.platform !== 'darwin' || isDev) {
        win.setMenuBarVisibility(false);

        return;
    }

    const template: MenuItemConstructorOptions[] = [
        {
            label: app.getName(),
            submenu: [
                {role: 'quit'}
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {role: 'cut'},
                {role: 'copy'},
                {role: 'paste'},
                {role: 'delete'},
                {role: 'selectall'}
            ] as MenuItemConstructorOptions[]
        }
    ];

    // hide "Start Dictation" submenu item in Edit menu
    systemPreferences.setUserDefault('NSDisabledDictationMenuItem', 'boolean', true as any);
    // hide "Emoji & Symbols" submenu item in Edit menu
    systemPreferences.setUserDefault('NSDisabledCharacterPaletteMenuItem', 'boolean', false as any);

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
};

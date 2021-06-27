import { app, BrowserWindow, Menu, MenuItemConstructorOptions, systemPreferences } from 'electron';
import isDev from 'electron-is-dev';

export const setMenu = (win: BrowserWindow, allowDevTools): void => {
    if (!allowDevTools && process.platform !== 'darwin') {
        win.setMenuBarVisibility(false);

        return;
    }

    const template: MenuItemConstructorOptions[] = [
        {
            label: app.getName(),
            submenu: [
                {role: 'toggleDevTools'},
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

    if (process.platform === 'darwin') {
        // hide "Start Dictation" submenu item in Edit menu
        systemPreferences.setUserDefault('NSDisabledDictationMenuItem', 'boolean', true as any);
        // hide "Emoji & Symbols" submenu item in Edit menu
        systemPreferences.setUserDefault('NSDisabledCharacterPaletteMenuItem', 'boolean', false as any);
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
};

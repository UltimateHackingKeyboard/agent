/// <reference path="./custom_types/electron-is-dev.d.ts"/>

import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as log from 'electron-log';
import * as path from 'path';
import { ProgressInfo } from 'electron-builder-http/out/ProgressCallbackTransform';
import { VersionInfo } from 'electron-builder-http/out/publishOptions';
import * as settings from 'electron-settings';
import * as isDev from 'electron-is-dev';

import { IpcEvents } from './shared/util';
import { ElectronDataStorageRepositoryService } from './services/electron-datastorage-repository.service';

// import './dev-extension';
require('electron-debug')({ showDevTools: false, enabled: true });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: Electron.BrowserWindow;

log.transports.file.level = 'debug';
autoUpdater.logger = log;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        title: 'UHK Agent',
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: true
        },
        icon: 'images/agent-icon.png'
    });
    win.setMenuBarVisibility(false);
    win.maximize();

    const indexPath = path.resolve(__dirname, './index.html');
    // and load the index.html of the app.

    win.loadURL(`file://${indexPath}`);

    win.on('page-title-updated', event => {
        event.preventDefault();
    });

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    win.webContents.on('did-finish-load', () => {
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', () => {
    saveFirtsRun();
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here

// =========================================================================
// Auto update events
// =========================================================================
function checkForUpdate() {
    if (isDev) {
        const msg = 'Application update is not working in dev mode.';
        log.info(msg);
        sendIpcToWindow(IpcEvents.autoUpdater.checkForUpdateNotAvailable, msg);
        return;
    }

    if (isFirstRun()) {
        const msg = 'Application update is skipping at first run.';
        log.info(msg);
        sendIpcToWindow(IpcEvents.autoUpdater.checkForUpdateNotAvailable, msg);
        return;
    }

    autoUpdater.allowPrerelease = allowPreRelease();
    autoUpdater.checkForUpdates();
}

autoUpdater.on('checking-for-update', () => {
    sendIpcToWindow(IpcEvents.autoUpdater.checkingForUpdate);
});

autoUpdater.on('update-available', (ev: any, info: VersionInfo) => {
    autoUpdater.downloadUpdate();
    sendIpcToWindow(IpcEvents.autoUpdater.updateAvailable, info);
});

autoUpdater.on('update-not-available', (ev: any, info: VersionInfo) => {
    sendIpcToWindow(IpcEvents.autoUpdater.updateNotAvailable, info);
});

autoUpdater.on('error', (ev: any, err: string) => {
    sendIpcToWindow(IpcEvents.autoUpdater.autoUpdateError, err.substr(0, 100));
});

autoUpdater.on('download-progress', (progressObj: ProgressInfo) => {
    sendIpcToWindow(IpcEvents.autoUpdater.autoUpdateDownloadProgress, progressObj);
});

autoUpdater.on('update-downloaded', (ev: any, info: VersionInfo) => {
    sendIpcToWindow(IpcEvents.autoUpdater.autoUpdateDownloaded, info);
});

ipcMain.on(IpcEvents.autoUpdater.updateAndRestart, () => autoUpdater.quitAndInstall(true));

ipcMain.on(IpcEvents.app.appStarted, () => {
    if (checkForUpdateAtStartup()) {
        checkForUpdate();
    }
});

ipcMain.on(IpcEvents.autoUpdater.checkForUpdate, () => checkForUpdate());

function isFirstRun() {
    if (!settings.has('firstRunVersion')) {
        return true;
    }
    const firstRunVersion = settings.get('firstRunVersion');
    log.info(`firstRunVersion: ${firstRunVersion}`);
    log.info(`package.version: ${app.getVersion()}`);

    return firstRunVersion !== app.getVersion();
}

function saveFirtsRun() {
    settings.set('firstRunVersion', app.getVersion());
}

function sendIpcToWindow(message: string, arg?: any) {
    log.info('sendIpcToWindow:', message, arg);
    if (!win || win.isDestroyed()) {
        return;
    }

    win.webContents.send(message, arg);
}

function allowPreRelease() {
    const settings = getAutoUpdateSettings();

    return settings && settings.usePreReleaseUpdate;
}

function checkForUpdateAtStartup() {
    const settings = getAutoUpdateSettings();

    return settings && settings.checkForUpdateOnStartUp;
}

function getAutoUpdateSettings() {
    const storageService = new ElectronDataStorageRepositoryService();
    return storageService.getAutoUpdateSettings();
}

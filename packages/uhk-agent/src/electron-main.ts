/// <reference path="./custom_types/electron-is-dev.d.ts"/>
/// <reference path="./custom_types/command-line-args.d.ts"/>

import './polyfills';
import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';

import * as path from 'path';
import * as url from 'url';
import * as commandLineArgs from 'command-line-args';
import { UhkHidDevice } from 'uhk-usb';

// import { ElectronDataStorageRepositoryService } from './services/electron-datastorage-repository.service';
import { CommandLineArgs } from 'uhk-common';
import { DeviceService } from './services/device.service';
import { logger } from './services/logger.service';
import { AppUpdateService } from './services/app-update.service';
import { AppService } from './services/app.service';
import { SudoService } from './services/sudo.service';

const optionDefinitions = [
    {name: 'addons', type: Boolean, defaultOption: false}
];

const options: CommandLineArgs = commandLineArgs(optionDefinitions);

// import './dev-extension';
// require('electron-debug')({ showDevTools: true, enabled: true });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: Electron.BrowserWindow;
autoUpdater.logger = logger;

let deviceService: DeviceService;
let uhkHidDeviceService: UhkHidDevice;
let appUpdateService: AppUpdateService;
let appService: AppService;
let sudoService: SudoService;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        title: 'UHK Agent',
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: true
        },
        icon: 'assets/images/agent-icon.png'
    });
    win.setMenuBarVisibility(false);
    win.maximize();
    uhkHidDeviceService = new UhkHidDevice(logger);
    deviceService = new DeviceService(logger, win, uhkHidDeviceService);
    appUpdateService = new AppUpdateService(logger, win, app);
    appService = new AppService(logger, win, deviceService, options, uhkHidDeviceService);
    sudoService = new SudoService(logger);
    // and load the index.html of the app.

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'renderer/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.on('page-title-updated', (event: any) => {
        event.preventDefault();
    });

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
        deviceService = null;
        appUpdateService = null;
        appService = null;
        uhkHidDeviceService = null;
        sudoService = null;
    });

    win.webContents.on('did-finish-load', () => {
    });

    win.webContents.on('crashed', (event: any) => {
        logger.error(event);
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
    if (appUpdateService) {
        appUpdateService.saveFirtsRun();
    }
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

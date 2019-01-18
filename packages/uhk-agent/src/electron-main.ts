/// <reference path="./custom_types/electron-is-dev.d.ts"/>
/// <reference path="./custom_types/command-line-args.d.ts"/>

import './polyfills';
import { app, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';

import * as path from 'path';
import * as url from 'url';
import * as commandLineArgs from 'command-line-args';
import { UhkHidDevice, UhkOperations } from 'uhk-usb';
// import { ElectronDataStorageRepositoryService } from './services/electron-datastorage-repository.service';
import { CommandLineArgs, LogRegExps } from 'uhk-common';
import { DeviceService } from './services/device.service';
import { logger } from './services/logger.service';
import { AppUpdateService } from './services/app-update.service';
import { AppService } from './services/app.service';
import { SudoService } from './services/sudo.service';
import * as isDev from 'electron-is-dev';
import { setMenu } from './electron-menu';

const optionDefinitions = [
    {name: 'addons', type: Boolean},
    {name: 'spe', type: Boolean} // simulate privilege escalation error
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
let uhkOperations: UhkOperations;
let appUpdateService: AppUpdateService;
let appService: AppService;
let sudoService: SudoService;

// https://github.com/megahertz/electron-log/issues/44
// console.debug starting with Chromium 58 this method is a no-op on Chromium browsers.
if (console.debug) {
    console.debug = (...args: any[]): void => {
        if (LogRegExps.writeRegExp.test(args[0])) {
            console.log(args[0]);
        } else if (LogRegExps.readRegExp.test(args[0])) {
            console.log(args[0]);
        } else if (LogRegExps.errorRegExp.test(args[0])) {
            console.log(args[0]);
        } else if (LogRegExps.transferRegExp.test(args[0])) {
            console.log(args[0]);
        } else {
            console.log(...args);
        }
    };
}

const isSecondInstance = app.makeSingleInstance(function (commandLine, workingDirectory) {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
        if (win.isMinimized()) {
            win.restore();
        }
        win.focus();
    }
});

if (isSecondInstance) {
    app.quit();
}

function createWindow() {
    if (isSecondInstance) {
        return;
    }

    logger.info('[Electron Main] Create new window.');
    let packagesDir;
    if (isDev) {
        packagesDir = path.join(path.join(process.cwd(), process.argv[1]), '../../../../tmp');
    } else {
        packagesDir = path.dirname(app.getAppPath());
    }

    logger.info(`[Electron Main] packagesDir: ${packagesDir}`);

    // Create the browser window.
    win = new BrowserWindow({
        title: 'UHK Agent',
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: true
        },
        icon: path.join(__dirname, 'renderer/assets/images/agent-app-icon.png')
    });
    setMenu(win);
    win.maximize();
    uhkHidDeviceService = new UhkHidDevice(logger, options, packagesDir);
    uhkOperations = new UhkOperations(logger, uhkHidDeviceService, packagesDir);
    deviceService = new DeviceService(logger, win, uhkHidDeviceService, uhkOperations, packagesDir);
    appUpdateService = new AppUpdateService(logger, win, app);
    appService = new AppService(logger, win, deviceService, options, uhkHidDeviceService);
    sudoService = new SudoService(logger, options);
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
        logger.info('[Electron Main] win closed');
        win = null;
        deviceService.close();
        deviceService = null;
        appUpdateService = null;
        appService = null;
        uhkHidDeviceService.close();
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
    if (appUpdateService) {
        appUpdateService.saveFirtsRun();
    }
    app.exit();
});

app.on('will-quit', () => {
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

/// <reference path="./custom_types/electron-is-dev.d.ts"/>

import './polyfills';
import { app, BrowserWindow } from 'electron';

import * as path from 'path';
import * as url from 'url';
import { UhkHidDevice, UhkOperations } from 'uhk-usb';
// import { ElectronDataStorageRepositoryService } from './services/electron-datastorage-repository.service';
import { getLogOptions } from 'uhk-common';
import { UhkBlhost } from 'uhk-usb';
import { DeviceService } from './services/device.service';
import { ElectronLogService } from './services/logger.service';
import { AppUpdateService } from './services/app-update.service';
import { AppService } from './services/app.service';
import { SudoService } from './services/sudo.service';
import isDev from 'electron-is-dev';
import { setMenu } from './electron-menu';
import { loadWindowState, saveWindowState } from './util/window';
import { options, cliUsage, reenumerateAndExit } from './util';
// import './dev-extension';
// require('electron-debug')({ showDevTools: true, enabled: true });

if (options.help) {
    console.log(cliUsage);
    process.exit(0);
}

const logger = new ElectronLogService();
logger.setLogOptions(getLogOptions(options));
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: Electron.BrowserWindow;

let deviceService: DeviceService;
let uhkBlhost: UhkBlhost;
let uhkHidDeviceService: UhkHidDevice;
let uhkOperations: UhkOperations;
let appUpdateService: AppUpdateService;
let appService: AppService;
let sudoService: SudoService;
let packagesDir: string;

let areServicesInited = false;

if (!areServicesInited) {
    logger.misc('[Electron Main] init services.');

    if (isDev) {
        packagesDir = path.join(path.join(process.cwd(), process.argv[1]), '../../../../tmp');
    } else {
        packagesDir = path.dirname(app.getAppPath());
    }

    logger.misc(`[Electron Main] packagesDir: ${packagesDir}`);

    uhkHidDeviceService = new UhkHidDevice(logger, options, packagesDir);
    uhkBlhost = new UhkBlhost(logger, packagesDir);
    uhkOperations = new UhkOperations(logger, uhkBlhost, uhkHidDeviceService);

    areServicesInited = true;
}

const isSecondInstance = !app.requestSingleInstanceLock();

function createWindow() {
    if (isSecondInstance) {
        return;
    }

    logger.misc('[Electron Main] Create new window.');

    const loadedWindowState = loadWindowState(logger);

    // Create the browser window.
    win = new BrowserWindow({
        title: 'UHK Agent',
        x: loadedWindowState.x,
        y: loadedWindowState.y,
        width: loadedWindowState.width,
        height: loadedWindowState.height,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            spellcheck: false,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'renderer/assets/images/agent-app-icon.png')
    });

    if (loadedWindowState.isFullScreen) {
        win.setFullScreen(true);
    } else if (loadedWindowState.isMaximized) {
        win.maximize();
    }

    setMenu(win);
    deviceService = new DeviceService(logger, win, uhkHidDeviceService, uhkOperations, packagesDir, options);
    appUpdateService = new AppUpdateService(logger, win, app);
    appService = new AppService(logger, win, deviceService, options, uhkHidDeviceService, packagesDir);
    sudoService = new SudoService(logger, options, deviceService, packagesDir);
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
    win.on('closed', async () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        logger.misc('[Electron Main] win closed');
        win = null;
        await deviceService.close();
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

    win.on('close', () => saveWindowState(win, logger));
    win.on('resize', () => saveWindowState(win, logger));
    win.on('move', () => saveWindowState(win, logger));
}

if (isSecondInstance) {
    app.quit();
} else if (options['reenumerate-and-exit']) {
    const reenumerateOptions = {
        logger,
        commandLineArgs: options,
        uhkHidDevice: uhkHidDeviceService
    };
    reenumerateAndExit(reenumerateOptions)
        .then(() => {
            logger.misc('Reenumeration process finished. Please unplug and plug your UHK.');
            process.exit(0);
        })
        .catch(error => {
            logger.error(error.message);
            logger.misc('Reenumeration process finished with error. Please unplug and plug your UHK.');
            process.exit(-1);
        });
} else {

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

    app.on('second-instance', () => {
        // Someone tried to run a second instance, we should focus our window.
        if (win) {
            if (win.isMinimized()) {
                win.restore();
            }
            win.focus();
        }
    });
}
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here

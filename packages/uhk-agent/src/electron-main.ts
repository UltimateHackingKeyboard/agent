import { app, BrowserWindow, systemPreferences } from 'electron';
import * as process from 'process';
import setElectronSettingsConfig from './set-electron-settings-config';
setElectronSettingsConfig();

// If the preferred reduced motion is ON then the font awesome icons don't spin.
// For some reason the reduced motion accessibility feature is on Laci's machine
// we could not switch off because we don't find the setting in the config files
// We switch off this feature in Agent. If someone complain about it then
// we will implement a more sophisticated solution.
systemPreferences.getAnimationSettings().prefersReducedMotion = false;

import * as path from 'path';
import * as url from 'url';
import { UhkHidDevice, UhkOperations } from 'uhk-usb';

import { getLogOptions } from 'uhk-common';
import { DeviceService } from './services/device.service';
import { ElectronLogService } from './services/logger.service';
import { AppUpdateService } from './services/app-update.service';
import { AppService } from './services/app.service';
import { SudoService } from './services/sudo.service';
import { SmartMacroDocService } from './services/smart-macro-doc.service';
import { TrayService } from './services/tray.service';
import isDev from 'electron-is-dev';
import { setMenu } from './electron-menu';
import { loadWindowState, saveWindowState } from './util/window';
import {
    captureOled,
    getWindowBackgroundColor,
    options,
    cliUsage,
    printStatusBuffer,
    printUsbDevices,
    printHardwareConfiguration,
    reenumerateAndExit,
    restoreUserConfiguration,
    writeHardwareConfiguration,
} from './util';

if (options.help) {
    console.log(cliUsage);
    process.exit(0);
}

const isMac = process.platform === "darwin";
const logger = new ElectronLogService();
logger.setLogOptions(getLogOptions(options));
logger.misc('[Electron Main] command line arguments', options);
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: Electron.BrowserWindow;

let deviceService: DeviceService;
let uhkHidDeviceService: UhkHidDevice;
let uhkOperations: UhkOperations;
let appUpdateService: AppUpdateService;
let appService: AppService;
let sudoService: SudoService;
let packagesDir: string;
let smartMacroDocService: SmartMacroDocService;
let trayService: TrayService;

let areServicesInited = false;

if (!areServicesInited) {
    logger.misc('[Electron Main] init services.');

    if (isDev) {
        packagesDir = path.join(process.cwd(), '../../tmp');
    } else {
        packagesDir = path.dirname(app.getAppPath());
    }

    logger.misc(`[Electron Main] packagesDir: ${packagesDir}`);

    uhkHidDeviceService = new UhkHidDevice(logger, options, packagesDir);
    uhkOperations = new UhkOperations(logger, uhkHidDeviceService);
    smartMacroDocService = new SmartMacroDocService(logger, packagesDir);

    // eslint-disable-next-line no-useless-assignment
    areServicesInited = true;
}

const isSecondInstance = !app.requestSingleInstanceLock();

async function createWindow() {
    if (isSecondInstance) {
        return;
    }

    logger.misc('[Electron Main] Create new window.');

    const iconPath = path.join(import.meta.dirname, 'renderer/assets/images/agent-app-icon.png');
    const loadedWindowState = loadWindowState(logger);
    if(!smartMacroDocService.isRunning) {
        await smartMacroDocService.start();
    }

    // Create the browser window.
    win = new BrowserWindow({
        title: 'UHK Agent',
        x: loadedWindowState.x,
        y: loadedWindowState.y,
        width: loadedWindowState.width,
        height: loadedWindowState.height,
        webPreferences: {
            contextIsolation: false,
            spellcheck: false,
            preload: path.join(import.meta.dirname, 'preload.js')
        },
        icon: iconPath,
        backgroundColor: await getWindowBackgroundColor(),
        show: false
    });

    trayService = new TrayService(logger, iconPath);
    trayService.init(win);

    if (loadedWindowState.isFullScreen) {
        win.setFullScreen(true);
    } else if (loadedWindowState.isMaximized) {
        win.maximize();
    }

    setMenu(win, options.devtools);
    deviceService = new DeviceService(logger, win, uhkHidDeviceService, uhkOperations, options, packagesDir);
    appUpdateService = new AppUpdateService(logger, win, options);
    appService = new AppService(logger, win, deviceService, options, packagesDir);
    sudoService = new SudoService(logger, options, deviceService, packagesDir);
    // and load the index.html of the app.

    win.loadURL(url.format({
        pathname: path.join(import.meta.dirname, 'renderer/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.on('page-title-updated', (event) => {
        event.preventDefault();
    });

    // Emitted when the window is closed.
    win.on('closed', () => {
        windowClosed()
            .catch((error) => {
                logger.error('[Electron Main] Error while closing window', error);
            })
    });

    win.once('ready-to-show', () => {
        void (async () => {
            await trayService.initTrayIfEnabled();

            if (options['start-minimized-to-tray']) {
                trayService.startInTray();
            } else {
                win.show();
            }
        })();
    });

    win.webContents.on('did-finish-load', () => {
    });

    // monaco-editor electron 34+ paste workaround https://github.com/microsoft/monaco-editor/issues/4855#issuecomment-3184259279
    win.webContents.on("before-input-event", (event, input) => {
        const isCmdOrCtrl = isMac ? input.meta === true : input.control === true;

        const hasShift =
            input.shift === true ||
            input.modifiers.includes("shift");

        const hasAlt =
            input.alt === true ||
            input.modifiers.includes("alt");

        // Prefer code (layout-agnostic)
        const isV = input.code === "KeyV" || input.key === "v";

        const shouldPaste =
            input.type === 'keyDown' &&
            isCmdOrCtrl &&
            !hasShift &&
            !hasAlt &&
            isV;

        if (shouldPaste) {
            // Native paste path (works with Monaco)
            win.webContents.paste();
            event.preventDefault();
        }
    })

    win.webContents.on('render-process-gone', (event, details) => {
        logger.misc(`[Electron Main] render-process-gone, reason: ${details.reason} exitCode: ${details.exitCode}`);
    });

    win.on('close', () => saveWindowState(win, logger));
}

async function windowClosed() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    logger.misc('[Electron Main] win closed');
    win = null;
    try {
        await deviceService.close();
    } catch (error) {
        // TODO: Investigate it deeper. It happens on MacOs 15+ sometimes
        logger.error('[Electron Main] Error while closing DeviceService when electron has been closed', error);
    }
    deviceService = null;
    appUpdateService = null;
    appService = null;
    await uhkHidDeviceService.close();
    uhkHidDeviceService = null;
    sudoService = null;
    await smartMacroDocService.stop();
    smartMacroDocService = null;
}

if (isSecondInstance) {
    app.quit();
} else if (options['capture-oled']) {
    captureOled({
        logger,
        commandLineArgs: options,
        uhkOperations,
    })
} else if (options['print-hardware-configuration']) {
    printHardwareConfiguration({ logger, uhkOperations })
} else if (options['print-status-buffer']) {
    printStatusBuffer({ logger, uhkOperations })
} else if (options['print-usb-devices']) {
    printUsbDevices()
        .then(() => {
            process.exit(0);
        })
        .catch(error => {
            console.error(error);
            process.exit(-1);
        });
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
} else if (options['restore-user-configuration']) {
    restoreUserConfiguration({
        logger,
        uhkOperations,
        commandLineArgs: options,
    })
} else if (options['write-hardware-configuration']) {
    writeHardwareConfiguration({
        logger,
        uhkOperations,
        commandLineArgs: options,
    })
} else {

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', () => {
        createWindow()
            .catch((error) => {
                logger.error('[Electron Main] when creating the window: ', error);
            });
    });

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
        app.exit();
    });

    app.on('before-quit', () => {
        trayService?.markQuitting();
    });

    app.on('will-quit', () => {
    });

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow()
                .catch((error) => {
                    logger.error('[Electron Main] when activating the app: ', error);
                });
        } else if (!win.isVisible()) {
            trayService.showWindow();
        }
    });

    app.on('second-instance', () => {
        // Someone tried to run a second instance, we should focus our window.
        if (win) {
            trayService.showWindow();
        }
    });
}
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here

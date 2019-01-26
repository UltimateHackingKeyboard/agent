import { ipcMain, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import { UpdateInfo, ProgressInfo } from 'builder-util-runtime';
import * as settings from 'electron-settings';
import * as isDev from 'electron-is-dev';
import * as storage from 'electron-settings';

import { AutoUpdateSettings, IpcEvents, LogService } from 'uhk-common';
import { MainServiceBase } from './main-service-base';

export class AppUpdateService extends MainServiceBase {

    private sendAutoUpdateNotification = false;

    constructor(protected logService: LogService,
                protected win: Electron.BrowserWindow,
                private app: Electron.App) {
        super(logService, win);

        this.initListeners();
        logService.info('[AppUpdateService] init success');
    }

    saveFirtsRun() {
        settings.set('firstRunVersion', this.app.getVersion());
    }

    private initListeners() {
        autoUpdater.on('checking-for-update', () => {
            this.logService.debug('[AppUpdateService] checking for update');
            this.sendIpcToWindow(IpcEvents.autoUpdater.checkingForUpdate);
        });

        autoUpdater.on('update-available', async (ev: any, info: UpdateInfo) => {
            this.logService.debug('[AppUpdateService] update available. Downloading started');
            await autoUpdater.downloadUpdate();
            this.sendIpcToWindow(IpcEvents.autoUpdater.updateAvailable, info);
        });

        autoUpdater.on('update-not-available', (ev: any, info: UpdateInfo) => {
            if (this.sendAutoUpdateNotification) {
                this.logService.debug('[AppUpdateService] update not available');
                this.sendIpcToWindow(IpcEvents.autoUpdater.updateNotAvailable, info);
            }
        });

        autoUpdater.on('error', (ev: any, err: string) => {
            this.logService.error('[AppUpdateService] error', err);
            let msg = 'Electron updater error';
            if (err) {
                msg = err.substr(0, 100);
            }

            this.sendIpcToWindow(IpcEvents.autoUpdater.autoUpdateError, msg);
        });

        autoUpdater.on('download-progress', (progressObj: ProgressInfo) => {
            this.sendIpcToWindow(IpcEvents.autoUpdater.autoUpdateDownloadProgress, progressObj);
        });

        autoUpdater.on('update-downloaded', (ev: any, info: UpdateInfo) => {
            this.logService.debug('[AppUpdateService] update downloaded');
            this.sendIpcToWindow(IpcEvents.autoUpdater.autoUpdateDownloaded, info);
        });

        ipcMain.on(IpcEvents.autoUpdater.updateAndRestart, () => {
            this.logService.debug('[AppUpdateService] update and restart from renderer process');
            return autoUpdater.quitAndInstall(true);
        });

        ipcMain.on(IpcEvents.app.appStarted, () => {
            if (this.checkForUpdateAtStartup()) {
                this.sendAutoUpdateNotification = false;
                this.logService.debug('[AppUpdateService] app started. Automatically check for update.');
                this.checkForUpdate();
            }
        });

        ipcMain.on(IpcEvents.autoUpdater.checkForUpdate, (event: Electron.Event, args: any[]) => {
            const allowPrerelease: boolean = args[0];
            // tslint:disable-next-line:max-line-length
            const logMsg = `[AppUpdateService] checkForUpdate request from renderer process. Allow prerelease: ${allowPrerelease}`;
            this.logService.debug(logMsg);
            this.sendAutoUpdateNotification = true;
            this.checkForUpdate(allowPrerelease);
        });
    }

    private checkForUpdate(allowPrerelease = false): void {
        if (isDev) {
            const msg = '[AppUpdateService] Application update is not working in dev mode.';
            this.logService.info(msg);

            if (this.sendAutoUpdateNotification) {
                this.sendIpcToWindow(IpcEvents.autoUpdater.checkForUpdateNotAvailable, msg);
            }

            return;
        }

        if (this.isFirstRun()) {
            const msg = '[AppUpdateService] Application update is skipping at first run.';
            this.logService.info(msg);

            if (this.sendAutoUpdateNotification) {
                this.sendIpcToWindow(IpcEvents.autoUpdater.checkForUpdateNotAvailable, msg);
            }

            return;
        }

        autoUpdater.allowPrerelease = allowPrerelease;
        autoUpdater.checkForUpdates()
            .then(() => {
                this.logService.debug('[AppUpdateService] checkForUpdate success');
            })
            .catch(error => {
                this.logService.error('[AppUpdateService] checkForUpdate error:', error);
            });
    }

    private isFirstRun() {
        if (!settings.has('firstRunVersion')) {
            return true;
        }
        const firstRunVersion = settings.get('firstRunVersion');
        this.logService.info(`firstRunVersion: ${firstRunVersion}`);
        this.logService.info(`package.version: ${this.app.getVersion()}`);

        return firstRunVersion !== this.app.getVersion();
    }

    private checkForUpdateAtStartup() {
        const autoUpdateSettings = this.getAutoUpdateSettings();
        const checkForUpdate = autoUpdateSettings && autoUpdateSettings.checkForUpdateOnStartUp;

        this.logService.debug('[AppUpdateService] check for update at startup:', {checkForUpdate, autoUpdateSettings});

        return checkForUpdate;
    }

    private getAutoUpdateSettings(): AutoUpdateSettings {
        const value = storage.get('auto-update-settings');
        if (!value) {
            return {checkForUpdateOnStartUp: false};
        }

        return JSON.parse(<string>value);
    }

}

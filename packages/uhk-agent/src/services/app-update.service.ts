import { ipcMain, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import { UpdateInfo, ProgressInfo } from 'builder-util-runtime';
import * as settings from 'electron-settings';
import * as isDev from 'electron-is-dev';
import * as storage from 'electron-settings';

import { IpcEvents, LogService } from 'uhk-common';
import { MainServiceBase } from './main-service-base';

export class AppUpdateService extends MainServiceBase {
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
            this.sendIpcToWindow(IpcEvents.autoUpdater.checkingForUpdate);
        });

        autoUpdater.on('update-available', async (ev: any, info: UpdateInfo) => {
            await autoUpdater.downloadUpdate();
            this.sendIpcToWindow(IpcEvents.autoUpdater.updateAvailable, info);
        });

        autoUpdater.on('update-not-available', (ev: any, info: UpdateInfo) => {
            this.sendIpcToWindow(IpcEvents.autoUpdater.updateNotAvailable, info);
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
            this.sendIpcToWindow(IpcEvents.autoUpdater.autoUpdateDownloaded, info);
        });

        ipcMain.on(IpcEvents.autoUpdater.updateAndRestart, () => {
            this.logService.debug('[AppUpdateService] update and restart from renderer process');
            return autoUpdater.quitAndInstall(true);
        });

        ipcMain.on(IpcEvents.app.appStarted, () => {
            if (this.checkForUpdateAtStartup()) {
                this.checkForUpdate();
            }
        });

        ipcMain.on(IpcEvents.autoUpdater.checkForUpdate, () => {
            this.logService.debug('[AppUpdateService] checkForUpdate request from renderer process');
            this.checkForUpdate();
        });
    }

    private checkForUpdate() {
        if (isDev) {
            const msg = '[AppUpdateService] Application update is not working in dev mode.';
            this.logService.info(msg);
            this.sendIpcToWindow(IpcEvents.autoUpdater.checkForUpdateNotAvailable, msg);
            return;
        }

        if (this.isFirstRun()) {
            const msg = '[AppUpdateService] Application update is skipping at first run.';
            this.logService.info(msg);
            this.sendIpcToWindow(IpcEvents.autoUpdater.checkForUpdateNotAvailable, msg);
            return;
        }

        autoUpdater.allowPrerelease = this.allowPreRelease();
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

    private allowPreRelease() {
        const autoUpdateSettings = this.getAutoUpdateSettings();

        return autoUpdateSettings && autoUpdateSettings.usePreReleaseUpdate;
    }

    private checkForUpdateAtStartup() {
        const autoUpdateSettings = this.getAutoUpdateSettings();
        const checkForUpdate = autoUpdateSettings && autoUpdateSettings.checkForUpdateOnStartUp;

        this.logService.debug('[AppUpdateService] check for update at startup:', {checkForUpdate, autoUpdateSettings});

        return checkForUpdate;
    }

    private getAutoUpdateSettings() {
        const value = storage.get('auto-update-settings');
        if (!value) {
            return {checkForUpdateOnStartUp: false, usePreReleaseUpdate: false};
        }

        return JSON.parse(<string>value);
    }

}

import { ipcMain, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import { ProgressInfo } from 'electron-builder-http/out/ProgressCallbackTransform';
import { VersionInfo } from 'electron-builder-http/out/publishOptions';
import * as settings from 'electron-settings';
import * as isDev from 'electron-is-dev';

import { IpcEvents, LogService } from 'uhk-common';
import { MainServiceBase } from './main-service-base';

export class AppUpdateService extends MainServiceBase {
    constructor(protected logService: LogService,
                protected win: Electron.BrowserWindow,
                private app: Electron.App) {
        super(logService, win);

        this.initListeners();
        logService.info('AppUpdateService init success');
    }

    saveFirtsRun() {
        settings.set('firstRunVersion', this.app.getVersion());
    }

    private initListeners() {
        autoUpdater.on('checking-for-update', () => {
            this.sendIpcToWindow(IpcEvents.autoUpdater.checkingForUpdate);
        });

        autoUpdater.on('update-available', (ev: any, info: VersionInfo) => {
            autoUpdater.downloadUpdate();
            this.sendIpcToWindow(IpcEvents.autoUpdater.updateAvailable, info);
        });

        autoUpdater.on('update-not-available', (ev: any, info: VersionInfo) => {
            this.sendIpcToWindow(IpcEvents.autoUpdater.updateNotAvailable, info);
        });

        autoUpdater.on('error', (ev: any, err: string) => {
            this.sendIpcToWindow(IpcEvents.autoUpdater.autoUpdateError, err.substr(0, 100));
        });

        autoUpdater.on('download-progress', (progressObj: ProgressInfo) => {
            this.sendIpcToWindow(IpcEvents.autoUpdater.autoUpdateDownloadProgress, progressObj);
        });

        autoUpdater.on('update-downloaded', (ev: any, info: VersionInfo) => {
            this.sendIpcToWindow(IpcEvents.autoUpdater.autoUpdateDownloaded, info);
        });

        ipcMain.on(IpcEvents.autoUpdater.updateAndRestart, () => autoUpdater.quitAndInstall(true));

        ipcMain.on(IpcEvents.app.appStarted, () => {
            if (this.checkForUpdateAtStartup()) {
                this.checkForUpdate();
            }
        });

        ipcMain.on(IpcEvents.autoUpdater.checkForUpdate, () => this.checkForUpdate());
    }

    private checkForUpdate() {
        if (isDev) {
            const msg = 'Application update is not working in dev mode.';
            this.logService.info(msg);
            this.sendIpcToWindow(IpcEvents.autoUpdater.checkForUpdateNotAvailable, msg);
            return;
        }

        if (this.isFirstRun()) {
            const msg = 'Application update is skipping at first run.';
            this.logService.info(msg);
            this.sendIpcToWindow(IpcEvents.autoUpdater.checkForUpdateNotAvailable, msg);
            return;
        }

        autoUpdater.allowPrerelease = this.allowPreRelease();
        autoUpdater.checkForUpdates();
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

        return autoUpdateSettings && autoUpdateSettings.checkForUpdateOnStartUp;
    }

    private getAutoUpdateSettings() {
        // const storageService = new ElectronDataStorageRepositoryService();
        // return storageService.getAutoUpdateSettings();
        return { checkForUpdateOnStartUp: false, usePreReleaseUpdate: false };
    }

}

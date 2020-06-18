import { ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import { UpdateInfo, ProgressInfo } from 'builder-util-runtime';
import settings from 'electron-settings';
import isDev from 'electron-is-dev';
import storage from 'electron-settings';

import { ApplicationSettings, IpcEvents, LogService } from 'uhk-common';
import { MainServiceBase } from './main-service-base';
import { UpdaterLoggerService } from './updater-logger.service';

export class AppUpdateService extends MainServiceBase {

    private sendAutoUpdateNotification = false;

    constructor(protected logService: LogService,
                protected win: Electron.BrowserWindow,
                private app: Electron.App) {
        super(logService, win);

        const updaterLogger = new UpdaterLoggerService(logService);
        autoUpdater.logger = updaterLogger;

        this.initListeners();
        logService.misc('[AppUpdateService] init success');
    }

    saveFirtsRun() {
        settings.set('firstRunVersion', this.app.getVersion());
    }

    private initListeners() {
        autoUpdater.on('checking-for-update', () => {
            this.logService.misc('[AppUpdateService] checking for update');
            this.sendIpcToWindow(IpcEvents.autoUpdater.checkingForUpdate);
        });

        autoUpdater.on('update-available', async (ev: any, info: UpdateInfo) => {
            this.logService.misc('[AppUpdateService] update available. Downloading started');
            await autoUpdater.downloadUpdate();
            this.sendIpcToWindow(IpcEvents.autoUpdater.updateAvailable, info);
        });

        autoUpdater.on('update-not-available', (ev: any, info: UpdateInfo) => {
            if (this.sendAutoUpdateNotification) {
                this.logService.misc('[AppUpdateService] update not available');
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
            this.logService.misc('[AppUpdateService] update downloaded');
            this.sendIpcToWindow(IpcEvents.autoUpdater.autoUpdateDownloaded, info);
        });

        ipcMain.on(IpcEvents.autoUpdater.updateAndRestart, () => {
            this.logService.misc('[AppUpdateService] update and restart from renderer process');
            return autoUpdater.quitAndInstall(true);
        });

        ipcMain.on(IpcEvents.app.appStarted, () => {
            if (this.checkForUpdateAtStartup()) {
                this.sendAutoUpdateNotification = false;
                this.logService.misc('[AppUpdateService] app started. Automatically check for update.');
                this.checkForUpdate();
            }
        });

        ipcMain.on(IpcEvents.autoUpdater.checkForUpdate, (event: Electron.Event, args: any[]) => {
            const allowPrerelease: boolean = args[0];
            // tslint:disable-next-line:max-line-length
            const logMsg = `[AppUpdateService] checkForUpdate request from renderer process. Allow prerelease: ${allowPrerelease}`;
            this.logService.misc(logMsg);
            this.sendAutoUpdateNotification = true;
            this.checkForUpdate(allowPrerelease);
        });
    }

    private checkForUpdate(allowPrerelease = false): void {
        if (isDev) {
            const msg = '[AppUpdateService] Application update is not working in dev mode.';
            this.logService.misc(msg);

            if (this.sendAutoUpdateNotification) {
                this.sendIpcToWindow(IpcEvents.autoUpdater.checkForUpdateNotAvailable, msg);
            }

            return;
        }

        if (this.isFirstRun()) {
            const msg = '[AppUpdateService] Application update is skipping at first run.';
            this.logService.misc(msg);

            if (this.sendAutoUpdateNotification) {
                this.sendIpcToWindow(IpcEvents.autoUpdater.checkForUpdateNotAvailable, msg);
            }

            return;
        }

        autoUpdater.allowPrerelease = allowPrerelease;
        autoUpdater.checkForUpdates()
            .then(() => {
                this.logService.misc('[AppUpdateService] checkForUpdate success');
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
        this.logService.misc(`firstRunVersion: ${firstRunVersion}`);
        this.logService.misc(`package.version: ${this.app.getVersion()}`);

        return firstRunVersion !== this.app.getVersion();
    }

    private checkForUpdateAtStartup() {
        const { checkForUpdateOnStartUp = true } = this.getApplicationSettings();

        this.logService.misc('[AppUpdateService] check for update at startup:', { checkForUpdateOnStartUp });

        return checkForUpdateOnStartUp;
    }

    private getApplicationSettings(): ApplicationSettings {
        const value = storage.get('application-settings');
        if (!value) {
            return {
                checkForUpdateOnStartUp: true,
                everAttemptedSavingToKeyboard: false
            };
        }

        return JSON.parse(<string>value);
    }

}

import { ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import { UpdateInfo, ProgressInfo } from 'builder-util-runtime';
import isDev from 'electron-is-dev';
import storage from 'electron-settings';
import { inspect } from 'node:util';

import {
    ApplicationSettings,
    CommandLineArgs,
    ERR_UPDATER_INVALID_SIGNATURE,
    IpcEvents,
    LogService,
} from 'uhk-common';
import { MainServiceBase } from './main-service-base';
import { getUpdaterLoggerService } from '../util';

autoUpdater.autoDownload = false;

export class AppUpdateService extends MainServiceBase {

    private sendAutoUpdateNotification = false;

    constructor(protected logService: LogService,
                protected win: Electron.BrowserWindow,
                private options: CommandLineArgs) {
        super(logService, win);

        autoUpdater.logger = getUpdaterLoggerService(logService);

        this.initListeners();
        logService.misc('[AppUpdateService] init success');

        if (options['simulate-invalid-codesign-signature']) {
            logService.misc('[AppUpdateService] init simulate invalid codesign timer');
            setTimeout(() => {
                this.sendIpcToWindow(IpcEvents.autoUpdater.autoUpdateError, ERR_UPDATER_INVALID_SIGNATURE);
            }, 10000)
        }
    }

    private initListeners() {
        autoUpdater.on('checking-for-update', () => {
            this.logService.misc('[AppUpdateService] checking for update');
            this.sendIpcToWindow(IpcEvents.autoUpdater.checkingForUpdate);
        });

        autoUpdater.on('update-available', async (info: UpdateInfo) => {
            this.logService.misc('[AppUpdateService] update available. Downloading started');
            await autoUpdater.downloadUpdate();
            this.sendIpcToWindow(IpcEvents.autoUpdater.updateAvailable, info);
        });

        autoUpdater.on('update-not-available', (info: UpdateInfo) => {
            if (this.sendAutoUpdateNotification) {
                this.logService.misc('[AppUpdateService] update not available');
                this.sendIpcToWindow(IpcEvents.autoUpdater.updateNotAvailable, info);
            }
        });

        autoUpdater.on('error', (error: Error, message: string) => {
            this.logService.error('[AppUpdateService] error', inspect(error));
            this.logService.error('[AppUpdateService] error message', message);
            if ((error as NodeJS.ErrnoException)?.code === ERR_UPDATER_INVALID_SIGNATURE) {
                this.sendIpcToWindow(IpcEvents.autoUpdater.autoUpdateError, ERR_UPDATER_INVALID_SIGNATURE);
                return
            }

            let msg = 'Electron updater error';
            if (message) {
                msg = message.substring(0, 100);
            }

            this.sendIpcToWindow(IpcEvents.autoUpdater.autoUpdateError, msg);
        });

        autoUpdater.on('download-progress', (progressObj: ProgressInfo) => {
            this.sendIpcToWindow(IpcEvents.autoUpdater.autoUpdateDownloadProgress, progressObj);
        });

        autoUpdater.on('update-downloaded', (info: UpdateInfo) => {
            this.logService.misc('[AppUpdateService] update downloaded');
            this.sendIpcToWindow(IpcEvents.autoUpdater.autoUpdateDownloaded, info);
        });

        ipcMain.on(IpcEvents.autoUpdater.updateAndRestart, () => {
            this.logService.misc('[AppUpdateService] update and restart from renderer process');
            return autoUpdater.quitAndInstall(true, true);
        });

        ipcMain.on(IpcEvents.app.appStarted, async () => {
            if (await this.checkForUpdateAtStartup()) {
                this.sendAutoUpdateNotification = false;
                this.logService.misc('[AppUpdateService] app started. Automatically check for update.');
                this.checkForUpdate();
            }
        });

        ipcMain.on(IpcEvents.autoUpdater.checkForUpdate, (event: Electron.Event, args: any[]) => {
            const allowPrerelease: boolean = args[0];
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

        autoUpdater.allowPrerelease = allowPrerelease;
        autoUpdater.checkForUpdates()
            .then(() => {
                this.logService.misc('[AppUpdateService] checkForUpdate success');
            })
            .catch(error => {
                this.logService.error('[AppUpdateService] checkForUpdate error:', error);
            });
    }

    private async checkForUpdateAtStartup() {
        const { checkForUpdateOnStartUp = true } = await this.getApplicationSettings();

        this.logService.misc('[AppUpdateService] check for update at startup:', { checkForUpdateOnStartUp });

        return checkForUpdateOnStartUp;
    }

    private async getApplicationSettings(): Promise<ApplicationSettings> {
        const value = await storage.get('application-settings');
        if (!value) {
            return {
                checkForUpdateOnStartUp: true,
                everAttemptedSavingToKeyboard: false
            };
        }

        return JSON.parse(<string>value);
    }

}

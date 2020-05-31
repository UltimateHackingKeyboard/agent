import { Injectable, NgZone } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import { IpcEvents, LogService } from 'uhk-common';
import { AppState } from '../store';
import { UpdateDownloadedAction, UpdateErrorAction } from '../store/actions/app-update.action';
import { CheckForUpdateFailedAction, CheckForUpdateSuccessAction } from '../store/actions/auto-update-settings';
import { IpcCommonRenderer } from './ipc-common-renderer';

/**
 * This service handle the application update events in the electron renderer process.
 *
 * The class contains parameters with 'any' type, because the relevant type definitions in
 * import { ProgressInfo } from 'electron-builder-http/out/ProgressCallbackTransform';
 * import { VersionInfo } from 'electron-builder-http/out/publishOptions';
 * but, typescript allow import these if import 'electron-updater' too, but I i don't want to import
 * the updater in renderer process.
 */
@Injectable()
export class AppUpdateRendererService {
    constructor(private store: Store<AppState>,
                private zone: NgZone,
                private ipcRenderer: IpcCommonRenderer,
                private logService: LogService) {
        this.registerEvents();
    }

    sendAppStarted() {
        this.ipcRenderer.send(IpcEvents.app.appStarted);
    }

    sendUpdateAndRestartApp() {
        this.ipcRenderer.send(IpcEvents.autoUpdater.updateAndRestart);
    }

    checkForUpdate(allowPrerelease: boolean): void {
        this.ipcRenderer.send(IpcEvents.autoUpdater.checkForUpdate, allowPrerelease);
    }

    private registerEvents() {
        this.ipcRenderer.on(IpcEvents.autoUpdater.updateAvailable, (event: string, arg: any) => {
            this.logService.misc(IpcEvents.autoUpdater.updateAvailable, arg);
        });

        this.ipcRenderer.on(IpcEvents.autoUpdater.updateNotAvailable, () => {
            this.logService.misc(IpcEvents.autoUpdater.updateNotAvailable);
            this.dispatchStoreAction(new CheckForUpdateSuccessAction('No update available'));
        });

        this.ipcRenderer.on(IpcEvents.autoUpdater.autoUpdateError, (event: string, arg: any) => {
            this.logService.misc(IpcEvents.autoUpdater.autoUpdateError, arg);
            this.dispatchStoreAction(new UpdateErrorAction(arg));
        });

        this.ipcRenderer.on(IpcEvents.autoUpdater.autoUpdateDownloadProgress, (event: string, arg: any) => {
            this.logService.misc(IpcEvents.autoUpdater.autoUpdateDownloadProgress, arg);
        });

        this.ipcRenderer.on(IpcEvents.autoUpdater.autoUpdateDownloaded, (event: string, arg: any) => {
            this.logService.misc(IpcEvents.autoUpdater.autoUpdateDownloaded, arg);
            this.dispatchStoreAction(new UpdateDownloadedAction(arg));
        });

        this.ipcRenderer.on(IpcEvents.autoUpdater.checkForUpdateNotAvailable, (event: string, arg: any) => {
            this.logService.misc(IpcEvents.autoUpdater.checkForUpdateNotAvailable, arg);
            this.dispatchStoreAction(new CheckForUpdateFailedAction(arg));
        });
    }

    private dispatchStoreAction(action: Action) {
        this.logService.misc(`[AppUpdateService] dispatch action: ${action.type}`);
        this.zone.run(() => this.store.dispatch(action));
    }
}

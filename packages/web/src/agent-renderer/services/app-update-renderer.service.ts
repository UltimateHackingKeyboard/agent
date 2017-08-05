import { Injectable, NgZone } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { ipcRenderer } from 'electron';

import { IpcEvents } from 'uhk-common';
import { AppState } from '../../app/store/index';
import { UpdateDownloadedAction, UpdateErrorAction } from '../../app/store/actions/app-update.action';
import { CheckForUpdateFailedAction, CheckForUpdateSuccessAction } from '../../app/store/actions/auto-update-settings';

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
                private zone: NgZone) {
        this.registerEvents();
    }

    sendAppStarted() {
        ipcRenderer.send(IpcEvents.app.appStarted);
    }

    sendUpdateAndRestartApp() {
        ipcRenderer.send(IpcEvents.autoUpdater.updateAndRestart);
    }

    checkForUpdate() {
        ipcRenderer.send(IpcEvents.autoUpdater.checkForUpdate);
    }

    private registerEvents() {
        ipcRenderer.on(IpcEvents.autoUpdater.updateAvailable, (event: string, arg: any) => {
            this.writeUpdateState(IpcEvents.autoUpdater.updateAvailable, arg);
        });

        ipcRenderer.on(IpcEvents.autoUpdater.updateNotAvailable, () => {
            this.writeUpdateState(IpcEvents.autoUpdater.updateNotAvailable);
            this.dispachStoreAction(new CheckForUpdateSuccessAction('No update available'));
        });

        ipcRenderer.on(IpcEvents.autoUpdater.autoUpdateError, (event: string, arg: any) => {
            this.writeUpdateState(IpcEvents.autoUpdater.autoUpdateError, arg);
            this.dispachStoreAction(new UpdateErrorAction(arg));
        });

        ipcRenderer.on(IpcEvents.autoUpdater.autoUpdateDownloadProgress, (event: string, arg: any) => {
            this.writeUpdateState(IpcEvents.autoUpdater.autoUpdateDownloadProgress, arg);
        });

        ipcRenderer.on(IpcEvents.autoUpdater.autoUpdateDownloaded, (event: string, arg: any) => {
            this.writeUpdateState(IpcEvents.autoUpdater.autoUpdateDownloaded, arg);
            this.dispachStoreAction(new UpdateDownloadedAction());
        });

        ipcRenderer.on(IpcEvents.autoUpdater.checkForUpdateNotAvailable, (event: string, arg: any) => {
            this.writeUpdateState(IpcEvents.autoUpdater.checkForUpdateNotAvailable, arg);
            this.dispachStoreAction(new CheckForUpdateFailedAction(arg));
        });
    }

    private dispachStoreAction(action: Action) {
        this.zone.run(() => this.store.dispatch(action));
    }

    private writeUpdateState(event: any, arg?: any) {
        console.log({ event, arg });
    }
}

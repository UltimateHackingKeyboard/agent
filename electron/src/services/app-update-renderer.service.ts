import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { ipcRenderer } from 'electron';

import { IpcEvents } from '../shared/util';
import { AppState } from '../store';
import { UpdateDownloadedAction } from '../store/actions/app-update.action';

/**
 * This service handle the application update events in the electron rendrel process.
 *
 * The class contains parameters with 'any' type, because the relevant type definitions in
 * import { ProgressInfo } from 'electron-builder-http/out/ProgressCallbackTransform';
 * import { VersionInfo } from 'electron-builder-http/out/publishOptions';
 * but, typescript allow import these if import 'electron-updater' too, but I i don't want to import
 * the updater in renderer process.
 */
@Injectable()
export class AppUpdateRendererService {
    constructor(private store: Store<AppState>) {
        this.registerEvents();
    }

    sendAppStarted() {
        ipcRenderer.send(IpcEvents.app.appStarted);
    }

    sendUpdateAndRestartApp() {
        ipcRenderer.send(IpcEvents.autoUpdater.updateAndRestart);
    }

    private registerEvents() {
        ipcRenderer.on(IpcEvents.autoUpdater.updateAvailable, (event: string, arg: any) => {
            this.writeUpdateState(IpcEvents.autoUpdater.updateAvailable, arg);
        });

        ipcRenderer.on(IpcEvents.autoUpdater.updateNotAvailable, () => {
            this.writeUpdateState(IpcEvents.autoUpdater.updateNotAvailable);
        });

        ipcRenderer.on(IpcEvents.autoUpdater.autoUpdateError, (event: string, arg: any) => {
            this.writeUpdateState(IpcEvents.autoUpdater.autoUpdateError, arg);
        });

        ipcRenderer.on(IpcEvents.autoUpdater.autoUpdateDownloadProgress, (event: string, arg: any) => {
            this.writeUpdateState(IpcEvents.autoUpdater.autoUpdateDownloadProgress, arg);
        });

        ipcRenderer.on(IpcEvents.autoUpdater.autoUpdateDownloaded, (event: string, arg: any) => {
            this.writeUpdateState(IpcEvents.autoUpdater.autoUpdateDownloaded, arg);
            this.dispachStoreAction(new UpdateDownloadedAction());
        });

    }

    private dispachStoreAction(action: Action) {
        this.store.dispatch(action);
    }

    private writeUpdateState(event: any, arg?: any) {
        console.log({ event, arg });
    }
}

import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { ipcRenderer } from 'electron';
import { IpcEvents } from '../shared/util';
import { AppState } from '../store';
import { UpdateDownloadedAction } from '../store/actions/app-update.action';

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
        ipcRenderer.on(IpcEvents.autoUpdater.updateAvailable, (event, arg) => {
            this.writeUpdateState(IpcEvents.autoUpdater.updateAvailable, arg);
        });

        ipcRenderer.on(IpcEvents.autoUpdater.updateNotAvailable, (event, arg) => {
            this.writeUpdateState(IpcEvents.autoUpdater.updateNotAvailable, arg);
        });

        ipcRenderer.on(IpcEvents.autoUpdater.autoUpdateError, (event, arg) => {
            this.writeUpdateState(IpcEvents.autoUpdater.autoUpdateError, arg);
        });

        ipcRenderer.on(IpcEvents.autoUpdater.autoUpdateDownloadProgress, (event, arg) => {
            this.writeUpdateState(IpcEvents.autoUpdater.autoUpdateDownloadProgress, arg);
        });

        ipcRenderer.on(IpcEvents.autoUpdater.autoUpdateDownloaded, (event, arg) => {
            this.writeUpdateState(IpcEvents.autoUpdater.autoUpdateDownloaded, arg);
            this.dispachStoreAction(new UpdateDownloadedAction());
        });

    }
    private dispachStoreAction(action: Action) {
        this.store.dispatch(action);
    }

    private writeUpdateState(event: any, arg: any) {
        console.log({ event, arg });
    }
}

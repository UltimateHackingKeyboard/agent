import { Injectable, NgZone } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import { AppStartInfo, IpcEvents, LogService } from 'uhk-common';
import { AppState } from '../store';
import { ElectronMainLogReceivedAction, ProcessAppStartInfoAction } from '../store/actions/app';
import { IpcCommonRenderer } from './ipc-common-renderer';

@Injectable()
export class AppRendererService {
    constructor(
        private store: Store<AppState>,
        private zone: NgZone,
        private ipcRenderer: IpcCommonRenderer,
        private logService: LogService
    ) {
        this.registerEvents();
        this.logService.info('[AppRendererService] init success ');
    }

    getAppStartInfo() {
        this.logService.info('[AppRendererService] getAppStartInfo');
        this.ipcRenderer.send(IpcEvents.app.getAppStartInfo);
    }

    exit() {
        this.logService.info('[AppRendererService] exit');
        this.ipcRenderer.send(IpcEvents.app.exit);
    }

    openUrl(url: string): void {
        this.logService.info(`[AppRendererService] open url: ${url}`);
        this.ipcRenderer.send(IpcEvents.app.openUrl, url);
    }

    private registerEvents() {
        this.ipcRenderer.on(IpcEvents.app.getAppStartInfoReply, (event: string, arg: AppStartInfo) => {
            this.dispachStoreAction(new ProcessAppStartInfoAction(arg));
        });

        this.ipcRenderer.on('__ELECTRON_LOG_RENDERER__', (event: string, level: string, message: string) => {
            this.zone.run(() => this.store.dispatch(new ElectronMainLogReceivedAction({ level, message })));
        });
    }

    private dispachStoreAction(action: Action) {
        this.logService.info('[AppRendererService] dispatch action', action);
        this.zone.run(() => this.store.dispatch(action));
    }
}

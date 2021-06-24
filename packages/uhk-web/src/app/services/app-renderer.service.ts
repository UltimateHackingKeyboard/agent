import { Injectable, NgZone } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import { AppStartInfo, IpcEvents, LogService } from 'uhk-common';
import { AppState } from '../store';
import { ElectronMainLogReceivedAction, ProcessAppStartInfoAction } from '../store/actions/app';
import { IpcCommonRenderer } from './ipc-common-renderer';

@Injectable()
export class AppRendererService {
    constructor(private store: Store<AppState>,
                private zone: NgZone,
                private ipcRenderer: IpcCommonRenderer,
                private logService: LogService) {
        this.registerEvents();
        this.logService.misc('[AppRendererService] init success ');
    }

    getAppStartInfo() {
        this.logService.misc('[AppRendererService] getAppStartInfo');
        this.ipcRenderer.send(IpcEvents.app.getAppStartInfo);
    }

    exit() {
        this.logService.misc('[AppRendererService] exit');
        this.ipcRenderer.send(IpcEvents.app.exit);
    }

    openUrl(url: string): void {
        this.logService.misc(`[AppRendererService] open url: ${url}`);
        this.ipcRenderer.send(IpcEvents.app.openUrl, url);
    }

    private registerEvents() {
        this.ipcRenderer.on(IpcEvents.app.getAppStartInfoReply, (event: string, arg: AppStartInfo) => {
            this.dispatchStoreAction(new ProcessAppStartInfoAction(arg));
        });

        this.ipcRenderer.on('__ELECTRON_LOG_IPC_default__', (event: string, { level, data }) => {
            const message = [];

            if (data.length > 0
                && data[data.length - 1]?.substr
                && data[data.length - 1]?.substr(0, 6) === 'color:'
                && data[0]?.substr
                && data[0]?.substr(0, 2) === '%c'
            ) {
                data = [
                    data[0].substr(2),
                    ...data.slice(1, data.length - 2)
                ];
            }

            for (const item of data) {
                message.push( typeof item === 'string' ? item : JSON.stringify(item));
            }

            this.zone.run(() => this.store.dispatch(new ElectronMainLogReceivedAction({ level, message: message.join(' ') })));
        });
    }

    private dispatchStoreAction(action: Action) {
        this.logService.misc(`[AppRendererService] dispatch action: ${action.type}`);
        this.zone.run(() => this.store.dispatch(action));
    }
}

import { Injectable, NgZone } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import { IpcEvents, AppStartInfo, LogService } from 'uhk-common';
import { AppState } from '../store/index';
import { ProcessAppStartInfoAction } from '../store/actions/app';
import { IpcCommonRenderer } from './ipc-common-renderer';

@Injectable()
export class AppRendererService {
    constructor(private store: Store<AppState>,
                private zone: NgZone,
                private ipcRenderer: IpcCommonRenderer,
                private logService: LogService) {
        this.registerEvents();
        this.logService.info('[AppRendererService] init success ');
    }

    getAppStartInfo() {
        this.logService.info('[AppRendererService] getAppStartInfo');
        this.ipcRenderer.send(IpcEvents.app.getAppStartInfo);
    }

    private registerEvents() {
        this.ipcRenderer.on(IpcEvents.app.getAppStartInfoReply, (event: string, arg: AppStartInfo) => {
            this.dispachStoreAction(new ProcessAppStartInfoAction(arg));
        });
    }

    private dispachStoreAction(action: Action) {
        this.logService.info('[AppRendererService] dispatch action', action);
        this.zone.run(() => this.store.dispatch(action));
    }
}

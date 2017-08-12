import { Injectable, NgZone } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import { IpcEvents, LogService } from 'uhk-common';
import { AppState } from '../store/index';
import { IpcCommonRenderer } from './ipc-common-renderer';
import { ConnectionStateChangedAction } from '../store/actions/device';

@Injectable()
export class DeviceRendererService {
    constructor(private store: Store<AppState>,
                private zone: NgZone,
                private ipcRenderer: IpcCommonRenderer,
                private logService: LogService) {
        this.registerEvents();
        this.logService.info('[DeviceRendererService] init success ');
    }

    private registerEvents() {
        this.ipcRenderer.on(IpcEvents.device.deviceConnectionStateChanged, (event: string, arg: boolean) => {
            this.dispachStoreAction(new ConnectionStateChangedAction(arg));
        });
    }

    private dispachStoreAction(action: Action) {
        this.logService.info('[AppRendererService] dispatch action', action);
        this.zone.run(() => this.store.dispatch(action));
    }
}

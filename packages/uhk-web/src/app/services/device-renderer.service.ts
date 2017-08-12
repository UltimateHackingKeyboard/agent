import { Injectable, NgZone } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import { IpcEvents, LogService, IpcResponse } from 'uhk-common';
import { AppState } from '../store/index';
import { IpcCommonRenderer } from './ipc-common-renderer';
import { ConnectionStateChangedAction, SaveLayerReplyAction, SetPrivilegeOnLinuxReplyAction } from '../store/actions/device';

@Injectable()
export class DeviceRendererService {
    constructor(private store: Store<AppState>,
                private zone: NgZone,
                private ipcRenderer: IpcCommonRenderer,
                private logService: LogService) {
        this.registerEvents();
        this.logService.info('[DeviceRendererService] init success ');
    }

    setPrivilegeOnLinux(): void {
        this.ipcRenderer.send(IpcEvents.device.setPrivilegeOnLinux);
    }

    saveUserConfiguration(buffer: Buffer): void {
        this.ipcRenderer.send(IpcEvents.device.saveUserConfiguration, JSON.stringify(buffer));
    }

    private registerEvents(): void {
        this.ipcRenderer.on(IpcEvents.device.deviceConnectionStateChanged, (event: string, arg: boolean) => {
            this.dispachStoreAction(new ConnectionStateChangedAction(arg));
        });

        this.ipcRenderer.on(IpcEvents.device.setPrivilegeOnLinuxReply, (event: string, response: IpcResponse) => {
            this.dispachStoreAction(new SetPrivilegeOnLinuxReplyAction(response));
        });

        this.ipcRenderer.on(IpcEvents.device.saveUserConfigurationReply, (event: string, response: IpcResponse) => {
            this.dispachStoreAction(new SaveLayerReplyAction(response));
        });
    }

    private dispachStoreAction(action: Action): void {
        this.logService.info('[DeviceRendererService] dispatch action', action);
        this.zone.run(() => this.store.dispatch(action));
    }
}

import { Injectable, NgZone } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import { IpcEvents, IpcResponse, LogService } from 'uhk-common';
import { AppState } from '../store';
import { IpcCommonRenderer } from './ipc-common-renderer';
import {
    ConnectionStateChangedAction,
    SaveConfigurationReplyAction,
    SetPrivilegeOnLinuxReplyAction,
    UpdateFirmwareReplyAction
} from '../store/actions/device';
import { LoadConfigFromDeviceReplyAction } from '../store/actions/user-config';

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

    loadConfigurationFromKeyboard(): void {
        this.ipcRenderer.send(IpcEvents.device.loadConfigurations);
    }

    updateFirmware(data?: Array<number>): void {
        if (data) {
            this.ipcRenderer.send(IpcEvents.device.updateFirmware, JSON.stringify(data));
        } else {
            this.ipcRenderer.send(IpcEvents.device.updateFirmware);
        }
    }

    startConnectionPoller(): void {
        this.ipcRenderer.send(IpcEvents.device.startConnectionPoller);
    }

    private registerEvents(): void {
        this.ipcRenderer.on(IpcEvents.device.deviceConnectionStateChanged, (event: string, arg: boolean) => {
            this.dispachStoreAction(new ConnectionStateChangedAction(arg));
        });

        this.ipcRenderer.on(IpcEvents.device.setPrivilegeOnLinuxReply, (event: string, response: IpcResponse) => {
            this.dispachStoreAction(new SetPrivilegeOnLinuxReplyAction(response));
        });

        this.ipcRenderer.on(IpcEvents.device.saveUserConfigurationReply, (event: string, response: IpcResponse) => {
            this.dispachStoreAction(new SaveConfigurationReplyAction(response));
        });

        this.ipcRenderer.on(IpcEvents.device.loadConfigurationReply, (event: string, response: string) => {
            this.dispachStoreAction(new LoadConfigFromDeviceReplyAction(JSON.parse(response)));
        });

        this.ipcRenderer.on(IpcEvents.device.updateFirmwareReply, (event: string, response: IpcResponse) => {
            this.dispachStoreAction(new UpdateFirmwareReplyAction(response));
        });
    }

    private dispachStoreAction(action: Action): void {
        this.logService.info('[DeviceRendererService] dispatch action', JSON.stringify(action));
        this.zone.run(() => this.store.dispatch(action));
    }
}

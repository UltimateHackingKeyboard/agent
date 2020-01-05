import { Injectable, NgZone } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import {
    DeviceConnectionState,
    IpcEvents,
    IpcResponse,
    LogService,
    SaveUserConfigurationData,
    UpdateFirmwareData
} from 'uhk-common';
import { AppState } from '../store';
import { IpcCommonRenderer } from './ipc-common-renderer';
import {
    ConnectionStateChangedAction,
    ReadConfigSizesReplyAction,
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

    saveUserConfiguration(data: SaveUserConfigurationData): void {
        this.ipcRenderer.send(IpcEvents.device.saveUserConfiguration, JSON.stringify(data));
    }

    loadConfigurationFromKeyboard(): void {
        this.ipcRenderer.send(IpcEvents.device.loadConfigurations);
    }

    updateFirmware(data: UpdateFirmwareData): void {
        this.ipcRenderer.send(IpcEvents.device.updateFirmware, JSON.stringify(data));
    }

    startConnectionPoller(): void {
        this.ipcRenderer.send(IpcEvents.device.startConnectionPoller);
    }

    recoveryDevice(): void {
        this.ipcRenderer.send(IpcEvents.device.recoveryDevice);
    }

    enableUsbStackTest(): void {
        this.ipcRenderer.send(IpcEvents.device.enableUsbStackTest);
    }

    readConfigSizes(): void {
        this.ipcRenderer.send(IpcEvents.device.readConfigSizes);
    }

    private registerEvents(): void {
        this.ipcRenderer.on(IpcEvents.device.deviceConnectionStateChanged, (event: string, arg: DeviceConnectionState) => {
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

        this.ipcRenderer.on(IpcEvents.device.readConfigSizesReply, (event: string, response: string) => {
            this.dispachStoreAction(new ReadConfigSizesReplyAction(JSON.parse(response)));
        });
    }

    private dispachStoreAction(action: Action): void {
        this.logService.info('[DeviceRendererService] dispatch action', JSON.stringify(action));
        this.zone.run(() => this.store.dispatch(action));
    }
}

import { Injectable, NgZone } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import {
    DeviceConnectionState,
    IpcEvents,
    IpcResponse,
    LogService,
    SaveUserConfigurationData,
    UpdateFirmwareData,
    UploadFileData
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
import { LoadConfigFromDeviceReplyAction, LoadUserConfigurationFromFileAction } from '../store/actions/user-config';
import { LoadUserConfigurationHistorySuccessAction } from '../store/actions/user-configuration-history.actions';

@Injectable()
export class DeviceRendererService {
    constructor(private store: Store<AppState>,
                private zone: NgZone,
                private ipcRenderer: IpcCommonRenderer,
                private logService: LogService) {
        this.registerEvents();
        this.logService.misc('[DeviceRendererService] init success ');
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

    loadUserConfigurationHistory(): void {
        this.ipcRenderer.send(IpcEvents.device.loadUserConfigHistory);
    }

    getUserConfigurationFromHistory(fileName: string): void {
        this.ipcRenderer.send(IpcEvents.device.getUserConfigFromHistory, fileName);
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

        this.ipcRenderer.on(IpcEvents.device.loadUserConfigHistoryReply, (event: string, response: Array<string>) => {
            this.dispachStoreAction(new LoadUserConfigurationHistorySuccessAction(response));
        });

        this.ipcRenderer.on(IpcEvents.device.getUserConfigFromHistoryReply, (event: string, response: UploadFileData) => {
            this.dispachStoreAction(new LoadUserConfigurationFromFileAction({
                uploadFileData: response,
                autoSave: false
            }));
        });
    }

    private dispachStoreAction(action: Action): void {
        this.logService.misc(`[DeviceRendererService] dispatch action ${action.type}`);
        this.zone.run(() => this.store.dispatch(action));
    }
}

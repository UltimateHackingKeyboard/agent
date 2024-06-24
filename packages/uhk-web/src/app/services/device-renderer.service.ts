import { Injectable, NgZone } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import {
    ChangeKeyboardLayoutIpcResponse,
    DeviceConnectionState,
    FirmwareJson,
    FirmwareUpgradeIpcResponse,
    HardwareModules,
    IpcEvents,
    IpcResponse,
    KeyboardLayout,
    LogService,
    SaveUserConfigurationData,
    UpdateFirmwareData,
    UploadFileData,
    UserConfiguration,
    UserConfigHistory,
    VersionInformation
} from 'uhk-common';

import { AppState } from '../store';
import { IpcCommonRenderer } from './ipc-common-renderer';
import {
    ChangeKeyboardLayoutReplyAction,
    ConnectionStateChangedAction,
    CurrentlyUpdateSkipModuleAction,
    CurrentlyUpdatingModuleAction,
    HardwareModulesLoadedAction,
    ReadConfigSizesReplyAction,
    RecoveryDeviceReplyAction,
    RecoveryModuleReplyAction,
    SaveConfigurationReplyAction,
    SetPrivilegeOnLinuxReplyAction,
    StatusBufferChangedAction,
    UpdateFirmwareJsonAction,
    UpdateFirmwareReplyAction
} from '../store/actions/device';
import { I2cWatchdogCounterChangedAction } from '../store/actions/advance-settings.action';
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

    changeKeyboardLayout(layout: KeyboardLayout, deviceId: number): void {
        this.ipcRenderer.send(IpcEvents.device.changeKeyboardLayout, layout, deviceId);
    }

    setPrivilegeOnLinux(): void {
        this.ipcRenderer.send(IpcEvents.device.setPrivilegeOnLinux);
    }

    saveUserConfiguration(data: SaveUserConfigurationData): void {
        this.ipcRenderer.send(IpcEvents.device.saveUserConfiguration, JSON.stringify(data));
    }

    loadConfigurationFromKeyboard(versionInformation: VersionInformation): void {
        this.ipcRenderer.send(IpcEvents.device.loadConfigurations, versionInformation);
    }

    updateFirmware(data: UpdateFirmwareData): void {
        this.ipcRenderer.send(IpcEvents.device.updateFirmware, JSON.stringify(data));
    }

    startConnectionPoller(): void {
        this.ipcRenderer.send(IpcEvents.device.startConnectionPoller);
    }

    recoveryDevice(userConfig: UserConfiguration): void {
        this.ipcRenderer.send(IpcEvents.device.recoveryDevice, userConfig.toJsonObject());
    }

    recoveryModule(moduleId: number): void {
        this.ipcRenderer.send(IpcEvents.device.recoveryModule, moduleId);
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

    toggleI2cDebugging(enabled: boolean): void {
        this.ipcRenderer.send(IpcEvents.device.toggleI2cDebugging, enabled);
    }

    private registerEvents(): void {
        this.ipcRenderer.on(IpcEvents.device.changeKeyboardLayoutReply, (event: string, response: ChangeKeyboardLayoutIpcResponse) => {
            this.dispachStoreAction(new ChangeKeyboardLayoutReplyAction(response));
        });

        this.ipcRenderer.on(IpcEvents.device.hardwareModulesLoaded, (event: string, response: HardwareModules) => {
            this.dispachStoreAction(new HardwareModulesLoadedAction(response));
        });

        this.ipcRenderer.on(IpcEvents.device.deviceConnectionStateChanged, (event: string, arg: DeviceConnectionState) => {
            this.dispachStoreAction(new ConnectionStateChangedAction(arg));
        });

        this.ipcRenderer.on(IpcEvents.device.i2cWatchdogCounterChanged, (event: string, counter) => {
            this.dispachStoreAction(new I2cWatchdogCounterChangedAction(counter));
        });

        this.ipcRenderer.on(IpcEvents.device.recoveryDeviceReply, (event: string, response: FirmwareUpgradeIpcResponse) => {
            this.dispachStoreAction(new RecoveryDeviceReplyAction(response));
        });

        this.ipcRenderer.on(IpcEvents.device.recoveryModuleReply, (event: string, response: FirmwareUpgradeIpcResponse) => {
            this.dispachStoreAction(new RecoveryModuleReplyAction(response));
        });

        this.ipcRenderer.on(IpcEvents.device.setPrivilegeOnLinuxReply, (event: string, response: IpcResponse) => {
            this.dispachStoreAction(new SetPrivilegeOnLinuxReplyAction(response));
        });

        this.ipcRenderer.on(IpcEvents.device.saveUserConfigurationReply, (event: string, response: IpcResponse) => {
            this.dispachStoreAction(new SaveConfigurationReplyAction(response));
        });

        this.ipcRenderer.on(IpcEvents.device.statusBufferChanged, (event: string, response: string) => {
            this.dispachStoreAction(new StatusBufferChangedAction(response));
        });

        this.ipcRenderer.on(IpcEvents.device.loadConfigurationReply, (event: string, response: string) => {
            this.dispachStoreAction(new LoadConfigFromDeviceReplyAction(JSON.parse(response)));
        });

        this.ipcRenderer.on(IpcEvents.device.updateFirmwareJson, (event: string, data: FirmwareJson) => {
            this.dispachStoreAction(new UpdateFirmwareJsonAction(data));
        });

        this.ipcRenderer.on(IpcEvents.device.moduleFirmwareUpgradeSkip, (event: string, response: string) => {
            this.dispachStoreAction(new CurrentlyUpdateSkipModuleAction(response));
        });

        this.ipcRenderer.on(IpcEvents.device.moduleFirmwareUpgrading, (event: string, response: string) => {
            this.dispachStoreAction(new CurrentlyUpdatingModuleAction(response));
        });

        this.ipcRenderer.on(IpcEvents.device.updateFirmwareReply, (event: string, response: FirmwareUpgradeIpcResponse) => {
            this.dispachStoreAction(new UpdateFirmwareReplyAction(response));
        });

        this.ipcRenderer.on(IpcEvents.device.readConfigSizesReply, (event: string, response: string) => {
            this.dispachStoreAction(new ReadConfigSizesReplyAction(JSON.parse(response)));
        });

        this.ipcRenderer.on(IpcEvents.device.loadUserConfigHistoryReply, (event: string, response: UserConfigHistory) => {
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

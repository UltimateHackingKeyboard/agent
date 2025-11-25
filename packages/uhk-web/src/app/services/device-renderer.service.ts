import { Injectable, NgZone } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import {
    AreBleAddressesPairedIpcResponse,
    ChangeKeyboardLayoutIpcResponse,
    CurrentlyUpdatingModuleInfo,
    DeviceConnectionState,
    DeviceVersionInformation,
    FirmwareJson,
    FirmwareUpgradeIpcResponse,
    HardwareConfiguration,
    HardwareModules,
    IpcEvents,
    IpcResponse,
    KeyboardLayout,
    LogService,
    ModuleFirmwareUpgradeSkipInfo,
    SaveUserConfigurationData,
    UHK_DEVICE_IDS_TYPE,
    UpdateFirmwareData,
    UploadFileData,
    UserConfiguration,
    UserConfigHistory,
    VersionInformation,
    ZephyrLogEntry,
} from 'uhk-common';

import { DeleteHostConnectionPayload } from '../models';
import { AppState } from '../store';
import {
    IsDongleZephyrLoggingEnabledReplyAction,
    IsLeftHalfZephyrLoggingEnabledReplyAction,
    IsRightHalfZephyrLoggingEnabledReplyAction,
    ZephyrLogAction,
} from '../store/actions/advance-settings.action';
import {
    DeleteHostConnectionFailedAction,
    DeleteHostConnectionSuccessAction,
    DonglePairingFailedAction,
    DonglePairingSuccessAction,
} from '../store/actions/dongle-pairing.action';
import { IpcCommonRenderer } from './ipc-common-renderer';
import {
    ChangeKeyboardLayoutReplyAction,
    CheckAreHostConnectionsPairedReplyAction,
    ConnectionStateChangedAction,
    DongleVersionInfoLoadedAction,
    EraseBleSettingReplyAction,
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
import {
    LeftHalfPairingFailedAction,
    LeftHalfPairingSuccessAction,
    I2cWatchdogCounterChangedAction,
} from '../store/actions/advance-settings.action';
import { LoadConfigFromDeviceReplyAction, LoadUserConfigurationFromFileAction } from '../store/actions/user-config';
import {
    DeleteUserConfigHistoryReplyAction,
    LoadUserConfigurationHistorySuccessAction,
} from '../store/actions/user-configuration-history.actions';

@Injectable()
export class DeviceRendererService {
    constructor(private store: Store<AppState>,
                private zone: NgZone,
                private ipcRenderer: IpcCommonRenderer,
                private logService: LogService) {
        this.registerEvents();
        this.logService.misc('[DeviceRendererService] init success ');
    }

    areBleAddressesPaired(addresses: string[]): void {
        this.ipcRenderer.send(IpcEvents.device.areBleAddressesPaired, addresses);
    }

    changeKeyboardLayout(layout: KeyboardLayout, hardwareConfiguration: HardwareConfiguration): void {
        this.ipcRenderer.send(IpcEvents.device.changeKeyboardLayout, layout, hardwareConfiguration.toJsonObject());
    }

    deleteHostConnection(data: DeleteHostConnectionPayload, isConnectedDongleAddress: boolean): void {
        this.ipcRenderer.send(IpcEvents.device.deleteHostConnection, {
            isConnectedDongleAddress,
            index: data.index,
            address: data.hostConnection.address,
        });
    }

    deleteUserConfigHistory(deviceUniqueId: number): void {
        this.ipcRenderer.send(IpcEvents.device.deleteUserConfigHistory, deviceUniqueId);
    }

    eraseBleSettings(): void {
        this.ipcRenderer.send(IpcEvents.device.eraseBleSettings);
    }

    isDongleZephyrLoggingEnabled(): void {
        this.ipcRenderer.send(IpcEvents.device.isDongleZephyrLoggingEnabled);
    }

    isLeftHalfZephyrLoggingEnabled(): void {
        this.ipcRenderer.send(IpcEvents.device.isLeftHalfZephyrLoggingEnabled);
    }

    isRightHalfZephyrLoggingEnabled(): void {
        this.ipcRenderer.send(IpcEvents.device.isRightHalfZephyrLoggingEnabled);
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

    recoveryDevice(userConfig: UserConfiguration, deviceId: UHK_DEVICE_IDS_TYPE): void {
        this.ipcRenderer.send(IpcEvents.device.recoveryDevice, {
            deviceId,
            userConfig: userConfig.toJsonObject()
        });
    }

    recoveryModule(moduleId: number): void {
        this.ipcRenderer.send(IpcEvents.device.recoveryModule, moduleId);
    }

    enableUsbStackTest(): void {
        this.ipcRenderer.send(IpcEvents.device.enableUsbStackTest);
    }

    rebootDevice(): void {
        this.ipcRenderer.send(IpcEvents.device.rebootDevice);
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

    startDonglePairing(): void {
        this.ipcRenderer.send(IpcEvents.device.startDonglePairing);
    }

    startLeftHalfPairing(): void {
        this.ipcRenderer.send(IpcEvents.device.startLeftHalfPairing);
    }

    toggleI2cDebugging(enabled: boolean): void {
        this.ipcRenderer.send(IpcEvents.device.toggleI2cDebugging, enabled);
    }

    toggleDongleZephyrLogging(enabled: boolean): void {
        this.ipcRenderer.send(IpcEvents.device.toggleDongleZephyrLogging, enabled);
    }

    toggleLeftHalfZephyrLogging(enabled: boolean): void {
        this.ipcRenderer.send(IpcEvents.device.toggleLeftHalfZephyrLogging, enabled);
    }

    toggleRightHalfZephyrLogging(enabled: boolean): void {
        this.ipcRenderer.send(IpcEvents.device.toggleRightHalfZephyrLogging, enabled);
    }

    private registerEvents(): void {
        this.ipcRenderer.on(IpcEvents.device.areBleAddressesPairedReply, (event: string, response: AreBleAddressesPairedIpcResponse) => {
            this.dispachStoreAction(new CheckAreHostConnectionsPairedReplyAction(response));
        });

        this.ipcRenderer.on(IpcEvents.device.changeKeyboardLayoutReply, (event: string, response: ChangeKeyboardLayoutIpcResponse) => {
            this.dispachStoreAction(new ChangeKeyboardLayoutReplyAction(response));
        });

        this.ipcRenderer.on(IpcEvents.device.deleteUserConfigHistoryReply, (event: string, response: IpcResponse) => {
            this.dispachStoreAction(new DeleteUserConfigHistoryReplyAction(response));
        });

        this.ipcRenderer.on(IpcEvents.device.dongleVersionInfoLoaded, (event: string, response: DeviceVersionInformation) => {
            this.dispachStoreAction(new DongleVersionInfoLoadedAction(response));
        });

        this.ipcRenderer.on(IpcEvents.device.deleteHostConnectionSuccess, (event: string, data: any) => {
            this.dispachStoreAction(new DeleteHostConnectionSuccessAction(data));
        });

        this.ipcRenderer.on(IpcEvents.device.deleteHostConnectionFailed, (event: string, message: string) => {
            this.dispachStoreAction(new DeleteHostConnectionFailedAction(message));
        });

        this.ipcRenderer.on(IpcEvents.device.eraseBleSettingsReply, (event: string, response: IpcResponse) => {
            this.dispachStoreAction(new EraseBleSettingReplyAction(response));
        });

        this.ipcRenderer.on(IpcEvents.device.hardwareModulesLoaded, (event: string, response: HardwareModules) => {
            this.dispachStoreAction(new HardwareModulesLoadedAction(response));
        });

        this.ipcRenderer.on(IpcEvents.device.isDongleZephyrLoggingEnabledReply, (event: string, enabled: boolean) => {
            this.dispachStoreAction(new IsDongleZephyrLoggingEnabledReplyAction(enabled));
        });

        this.ipcRenderer.on(IpcEvents.device.isLeftHalfZephyrLoggingEnabledReply, (event: string, enabled: boolean) => {
            this.dispachStoreAction(new IsLeftHalfZephyrLoggingEnabledReplyAction(enabled));
        });

        this.ipcRenderer.on(IpcEvents.device.isRightHalfZephyrLoggingEnabledReply, (event: string, enabled: boolean) => {
            this.dispachStoreAction(new IsRightHalfZephyrLoggingEnabledReplyAction(enabled));
        });

        this.ipcRenderer.on(IpcEvents.device.deviceConnectionStateChanged, (event: string, arg: DeviceConnectionState) => {
            this.dispachStoreAction(new ConnectionStateChangedAction(arg));
        });

        this.ipcRenderer.on(IpcEvents.device.i2cWatchdogCounterChanged, (event: string, counter: number) => {
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

        this.ipcRenderer.on(IpcEvents.device.moduleFirmwareUpgradeSkip, (event: string, response: ModuleFirmwareUpgradeSkipInfo) => {
            this.dispachStoreAction(new CurrentlyUpdateSkipModuleAction(response));
        });

        this.ipcRenderer.on(IpcEvents.device.moduleFirmwareUpgrading, (event: string, response: CurrentlyUpdatingModuleInfo) => {
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

        this.ipcRenderer.on(IpcEvents.device.donglePairingSuccess, (event: string, bleAddress: string) => {
            this.store.dispatch(new DonglePairingSuccessAction(bleAddress));
        });

        this.ipcRenderer.on(IpcEvents.device.donglePairingFailed, (event: string, message: string) => {
            this.store.dispatch(new DonglePairingFailedAction(message));
        });

        this.ipcRenderer.on(IpcEvents.device.leftHalfPairingSuccess, (event: string, bleAddress: string) => {
            this.store.dispatch(new LeftHalfPairingSuccessAction(bleAddress));
        });

        this.ipcRenderer.on(IpcEvents.device.leftHalfPairingFailed, (event: string, message: string) => {
            this.store.dispatch(new LeftHalfPairingFailedAction(message));
        });

        this.ipcRenderer.on(IpcEvents.device.zephyrLog, (event: string, log: ZephyrLogEntry) => {
            this.store.dispatch(new ZephyrLogAction(log));
        });
    }

    private dispachStoreAction(action: Action): void {
        this.logService.misc(`[DeviceRendererService] dispatch action ${action.type}`);
        this.zone.run(() => this.store.dispatch(action));
    }
}

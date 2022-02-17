import { ipcMain } from 'electron';
import { cloneDeep, isEqual } from 'lodash';
import {
    ConfigurationReply,
    DeviceConnectionState,
    findUhkModuleById,
    FirmwareUpgradeIpcResponse,
    getHardwareConfigFromDeviceResponse,
    HardwareModules,
    IpcEvents,
    IpcResponse,
    LEFT_HALF_MODULE,
    LeftSlotModules,
    LogService,
    mapObjectToUserConfigBinaryBuffer,
    ModuleInfo,
    ModuleSlotToId,
    SaveUserConfigurationData,
    UpdateFirmwareData,
    UploadFileData,
    UHK_MODULES,
    RightSlotModules,
    RIGHT_HALF_FIRMWARE_UPGRADE_MODULE_NAME,
    getUserConfigFromJsonObject
} from 'uhk-common';
import {
    checkFirmwareAndDeviceCompatibility,
    getCurrentUhkDeviceProduct,
    getCurrentUhkDeviceProductByBootloaderId,
    getDeviceFirmwarePath,
    getFirmwarePackageJson,
    getModuleFirmwarePath,
    snooze,
    TmpFirmware,
    UhkHidDevice,
    UhkOperations,
    usbDeviceJsonFormatter,
    waitForDevice
} from 'uhk-usb';
import { emptyDir } from 'fs-extra';
import * as path from 'path';
import * as fs from 'fs';
import os from 'os';

import { QueueManager } from './queue-manager';
import {
    backupUserConfiguration,
    getBackupUserConfigurationContent,
    getUserConfigFromHistoryAsync,
    loadUserConfigHistoryAsync,
    saveTmpFirmware,
    saveUserConfigHistoryAsync
} from '../util';

/**
 * IpcMain pair of the UHK Communication
 * Functionality:
 * - Send UserConfiguration to the UHK Device
 * - Read UserConfiguration from the UHK Device
 */
export class DeviceService {
    private _pollerAllowed: boolean;
    private _uhkDevicePolling: boolean;
    private queueManager = new QueueManager();

    constructor(private logService: LogService,
                private win: Electron.BrowserWindow,
                private device: UhkHidDevice,
                private operations: UhkOperations,
                private rootDir: string
    ) {
        this.uhkDevicePoller()
            .catch(error => {
                this.logService.error('[DeviceService] UHK Device poller error', error);
            });

        this.device.getUdevInfoAsync()
            .then(info => {
                this.logService.misc('[DeviceService] Udev info:', info);
            })
            .catch(error => {
                this.logService.misc('[DeviceService] Cannot query udev info:', error);
            });

        ipcMain.on(IpcEvents.device.saveUserConfiguration, (...args: any[]) => {
            this.queueManager.add({
                method: this.saveUserConfiguration,
                bind: this,
                params: args,
                asynchronous: true
            });
        });

        ipcMain.on(IpcEvents.device.loadConfigurations, (...args: any[]) => {
            this.queueManager.add({
                method: this.loadConfigurations,
                bind: this,
                params: args,
                asynchronous: true
            });
        });

        ipcMain.on(IpcEvents.device.updateFirmware, (...args: any[]) => {
            this.queueManager.add({
                method: this.updateFirmware,
                bind: this,
                params: args,
                asynchronous: true
            });
        });

        ipcMain.on(IpcEvents.device.startConnectionPoller, this.startPollUhkDevice.bind(this));

        ipcMain.on(IpcEvents.device.recoveryDevice, (...args: any[]) => {
            this.queueManager.add({
                method: this.recoveryDevice,
                bind: this,
                params: args,
                asynchronous: true
            });
        });

        ipcMain.on(IpcEvents.device.recoveryModule, (...args: any[]) => {
            this.queueManager.add({
                method: this.recoveryModule,
                bind: this,
                params: args,
                asynchronous: true
            });
        });

        ipcMain.on(IpcEvents.device.enableUsbStackTest, (...args: any[]) => {
            this.queueManager.add({
                method: this.enableUsbStackTest,
                bind: this,
                params: args,
                asynchronous: true
            });
        });

        ipcMain.on(IpcEvents.device.readConfigSizes, (...args: any[]) => {
            this.queueManager.add({
                method: this.readConfigSizes,
                bind: this,
                params: args,
                asynchronous: true
            });
        });

        ipcMain.on(IpcEvents.device.getUserConfigFromHistory, this.getUserConfigFromHistory.bind(this));
        ipcMain.on(IpcEvents.device.loadUserConfigHistory, this.loadUserConfigFromHistory.bind(this));

        logService.misc('[DeviceService] init success');
    }

    /**
     * Return with the actual UserConfiguration from UHK Device
     * @returns {Promise<Buffer>}
     */
    public async loadConfigurations(event: Electron.IpcMainEvent): Promise<void> {
        let response: ConfigurationReply;

        try {
            await this.stopPollUhkDevice();

            await this.operations.waitUntilKeyboardBusy();
            const result = await this.operations.loadConfigurations();
            const modules: HardwareModules = await this.getHardwareModules(false);

            const hardwareConfig = getHardwareConfigFromDeviceResponse(result.hardwareConfiguration);
            const uniqueId = hardwareConfig.uniqueId;

            response = {
                success: true,
                ...result,
                modules,
                backupConfiguration: await getBackupUserConfigurationContent(this.logService, uniqueId)
            };
        } catch (error) {
            response = {
                success: false,
                error: error.message
            };
        } finally {
            this.device.close();
            this.startPollUhkDevice();
        }

        event.sender.send(IpcEvents.device.loadConfigurationReply, JSON.stringify(response));
    }

    public async getHardwareModules(catchError: boolean): Promise<HardwareModules> {
        try {
            await this.operations.waitUntilKeyboardBusy();

            const hardwareModules = {
                moduleInfos: [],
                rightModuleInfo: await this.operations.getRightModuleVersionInfo()
            };

            const halvesStates = await this.device.getHalvesStates();

            const leftModuleInfo: ModuleInfo = {
                module: LEFT_HALF_MODULE,
                info: {}
            };
            hardwareModules.moduleInfos.push(leftModuleInfo);

            if (halvesStates.isLeftHalfConnected) {
                leftModuleInfo.info = await this.operations.getModuleVersionInfo(LEFT_HALF_MODULE.slotId);
            }

            if (halvesStates.leftModuleSlot !== LeftSlotModules.NoModule) {
                const module = findUhkModuleById(halvesStates.leftModuleSlot);

                hardwareModules.moduleInfos.push({
                    module: module,
                    info: await this.operations.getModuleVersionInfo(module.slotId)
                });
            }

            if (halvesStates.rightModuleSlot !== RightSlotModules.NoModule) {
                const module = findUhkModuleById(halvesStates.rightModuleSlot);

                hardwareModules.moduleInfos.push({
                    module: module,
                    info: await this.operations.getModuleVersionInfo(module.slotId)
                });
            }

            return hardwareModules;
        } catch (err) {
            if (!catchError) {
                throw err;
            }

            this.logService.error('[DeviceService] Read hardware modules information failed', err);

            return {
                moduleInfos: [],
                rightModuleInfo: {}
            };
        }
    }

    public async close(): Promise<void> {
        await this.stopPollUhkDevice();
        this.logService.misc('[DeviceService] Device connection checker stopped.');
    }

    public async updateFirmware(event: Electron.IpcMainEvent, args?: Array<string>): Promise<void> {
        const response = new FirmwareUpgradeIpcResponse();
        const data: UpdateFirmwareData = JSON.parse(args[0]);
        const userConfig = getUserConfigFromJsonObject(data.userConfig);
        let firmwarePathData: TmpFirmware;

        try {
            firmwarePathData = data.uploadFile
                ? await saveTmpFirmware(data.uploadFile)
                : this.getDefaultFirmwarePathData();

            const packageJson = await getFirmwarePackageJson(firmwarePathData);
            this.logService.misc(`[DeviceService] Operating system: ${os.type()} ${os.release()} ${os.arch()}`);
            this.logService.misc('[DeviceService] Agent version:', data.versionInformation.version);
            this.logService.misc('[DeviceService] New firmware version:', packageJson.firmwareVersion);

            event.sender.send(IpcEvents.device.updateFirmwareJson, packageJson);

            const uhkDeviceProduct = getCurrentUhkDeviceProduct();
            checkFirmwareAndDeviceCompatibility(packageJson, uhkDeviceProduct);

            await this.stopPollUhkDevice();

            const hardwareModules = await this.getHardwareModules(false);

            this.logService.misc('[DeviceService] UHK Device firmware upgrade starts:',
                JSON.stringify(uhkDeviceProduct, usbDeviceJsonFormatter));
            const deviceFirmwarePath = getDeviceFirmwarePath(uhkDeviceProduct, packageJson);

            this.logService.misc('[DeviceService] Device right firmware version:',
                hardwareModules.rightModuleInfo.firmwareVersion);
            if (data.forceUpgrade || hardwareModules.rightModuleInfo.firmwareVersion !== packageJson.firmwareVersion) {
                event.sender.send(IpcEvents.device.moduleFirmwareUpgrading, RIGHT_HALF_FIRMWARE_UPGRADE_MODULE_NAME);
                await this.operations.updateRightFirmwareWithKboot(deviceFirmwarePath, uhkDeviceProduct);
                this.logService.misc('[DeviceService] Waiting for keyboard');
                await waitForDevice(uhkDeviceProduct.vendorId, uhkDeviceProduct.keyboardPid);
                this.logService.config(
                    '[DeviceService] User configuration will be saved after right module firmware upgrade',
                    data.userConfig);
                const buffer = mapObjectToUserConfigBinaryBuffer(userConfig);
                await this.operations.saveUserConfiguration(buffer);
            } else {
                this.logService.misc('Skip right firmware upgrade.');
            }

            const leftModuleInfo: ModuleInfo = hardwareModules.moduleInfos
                .find(moduleInfo => moduleInfo.module.slotId === ModuleSlotToId.leftHalf);
            this.logService.misc('[DeviceService] Left module firmware version: ', leftModuleInfo.info.firmwareVersion);
            if (data.forceUpgrade || leftModuleInfo.info.firmwareVersion !== packageJson.firmwareVersion) {
                event.sender.send(IpcEvents.device.moduleFirmwareUpgrading, leftModuleInfo.module.name);
                await this.operations
                    .updateModuleWithKboot(
                        getModuleFirmwarePath(leftModuleInfo.module, packageJson),
                        uhkDeviceProduct,
                        leftModuleInfo.module
                    );
            } else {
                this.logService.misc('[DeviceService] Skip left firmware upgrade.');
            }

            for (const moduleInfo of hardwareModules.moduleInfos) {
                if (moduleInfo.module.slotId === ModuleSlotToId.leftHalf) {
                    // Left half upgrade mandatory, it is running before the other modules upgrade.
                }
                else if (moduleInfo.module.firmwareUpgradeSupported) {
                    // tslint:disable-next-line:max-line-length
                    this.logService.misc(`[DeviceService] "${moduleInfo.module.name}" firmware version:`, moduleInfo.info.firmwareVersion);
                    if (data.forceUpgrade ||  moduleInfo.info.firmwareVersion !== packageJson.firmwareVersion) {
                        event.sender.send(IpcEvents.device.moduleFirmwareUpgrading, moduleInfo.module.name);
                        await this.operations
                            .updateModuleWithKboot(
                                getModuleFirmwarePath(moduleInfo.module, packageJson),
                                uhkDeviceProduct,
                                moduleInfo.module
                            );
                        this.logService.misc(`[DeviceService] "${moduleInfo.module.name}" firmware update done.`);
                    } else {
                        this.logService.misc(`[DeviceService] Skip "${moduleInfo.module.name}" firmware upgrade.`);
                    }
                } else {
                    this.logService.misc(`[DeviceService] Skip "${moduleInfo.module.name}" firmware upgrade. Currently not supported`);
                }
            }

            response.success = true;
            response.modules = await this.getHardwareModules(false);
        } catch (error) {
            const err = { message: error.message, stack: error.stack };
            this.logService.error('[DeviceService] updateFirmware error', err);

            response.modules = await this.getHardwareModules(true);
            response.error = err;
        }

        if (data.uploadFile) {
            await emptyDir(firmwarePathData.tmpDirectory);
        }

        await snooze(500);

        this.startPollUhkDevice();

        event.sender.send(IpcEvents.device.updateFirmwareReply, response);
    }

    public async recoveryDevice(event: Electron.IpcMainEvent, args: Array<any>): Promise<void> {
        const response = new FirmwareUpgradeIpcResponse();

        try {
            const userConfig = getUserConfigFromJsonObject(args[0]);
            const firmwarePathData: TmpFirmware = this.getDefaultFirmwarePathData();
            const packageJson = await getFirmwarePackageJson(firmwarePathData);
            await this.stopPollUhkDevice();

            const uhkDeviceProduct = getCurrentUhkDeviceProductByBootloaderId();
            checkFirmwareAndDeviceCompatibility(packageJson, uhkDeviceProduct);

            this.logService.misc(
                '[DeviceService] UHK Device recovery starts:',
                JSON.stringify(uhkDeviceProduct, usbDeviceJsonFormatter));
            const deviceFirmwarePath = getDeviceFirmwarePath(uhkDeviceProduct, packageJson);

            await this.operations.updateRightFirmwareWithKboot(deviceFirmwarePath, uhkDeviceProduct);

            this.logService.misc('[DeviceService] Waiting for keyboard');
            await waitForDevice(uhkDeviceProduct.vendorId, uhkDeviceProduct.keyboardPid);

            this.logService.config(
                '[DeviceService] User configuration will be saved after right module recovery',
                userConfig);
            const buffer = mapObjectToUserConfigBinaryBuffer(userConfig);
            await this.operations.saveUserConfiguration(buffer);

            response.modules = await this.getHardwareModules(false);
            response.success = true;
        } catch (error) {
            const err = { message: error.message, stack: error.stack };
            this.logService.error('[DeviceService] updateFirmware error', err);

            response.modules = {
                moduleInfos: [],
                rightModuleInfo: {}
            };
            response.error = err;
        }

        this.startPollUhkDevice();
        await snooze(500);
        event.sender.send(IpcEvents.device.recoveryDeviceReply, response);
    }

    public async recoveryModule(event: Electron.IpcMainEvent, args: Array<any>): Promise<void> {
        const response = new FirmwareUpgradeIpcResponse();
        const moduleId: number = args[0];

        try {
            const firmwarePathData: TmpFirmware = this.getDefaultFirmwarePathData();
            const packageJson = await getFirmwarePackageJson(firmwarePathData);
            await this.stopPollUhkDevice();

            const uhkDeviceProduct = getCurrentUhkDeviceProduct();
            checkFirmwareAndDeviceCompatibility(packageJson, uhkDeviceProduct);

            this.logService.misc(
                '[DeviceService] UHK Module recovery starts:',
                JSON.stringify(uhkDeviceProduct, usbDeviceJsonFormatter));

            const uhkModule = UHK_MODULES.find(module => module.id === moduleId);
            this.logService.misc('[DeviceService] UHK Module: ', JSON.stringify(uhkModule));

            await this.operations
                .updateModuleWithKboot(
                    getModuleFirmwarePath(uhkModule, packageJson),
                    uhkDeviceProduct,
                    uhkModule
                );

            response.modules = await this.getHardwareModules(false);
            response.success = true;
        } catch (error) {
            const err = { message: error.message, stack: error.stack };
            this.logService.error('[DeviceService] Module recovery error', err);

            response.modules = await this.getHardwareModules(true);
            response.error = err;
        }

        this.startPollUhkDevice();
        await snooze(500);
        event.sender.send(IpcEvents.device.recoveryModuleReply, response);
    }

    public async enableUsbStackTest(event: Electron.Event) {
        try {
            await this.stopPollUhkDevice();
            await this.operations.enableUsbStackTest();
        } finally {
            this.startPollUhkDevice();
        }
    }

    public async readConfigSizes(event: Electron.IpcMainEvent): Promise<void> {
        try {
            await this.stopPollUhkDevice();
            const configSizes = await this.operations.getConfigSizesFromKeyboard();
            event.sender.send(IpcEvents.device.readConfigSizesReply, JSON.stringify(configSizes));
        } finally {
            this.startPollUhkDevice();
        }
    }

    public startPollUhkDevice(): void {
        this.logService.misc('[DeviceService] start poll UHK Device');
        this._pollerAllowed = true;
    }

    public async stopPollUhkDevice(): Promise<void> {
        this.logService.misc('[DeviceService] stop poll UHK Device');
        return new Promise<void>(async resolve => {
            this._pollerAllowed = false;

            while (true) {
                if (!this._uhkDevicePolling) {
                    this.logService.misc('[DeviceService] stopped poll UHK Device');
                    return resolve();
                }

                await snooze(100);
            }
        });
    }

    /**
     * HID API not support device attached and detached event.
     * This method check the keyboard is attached to the computer or not.
     * The halves are connected and merged or not.
     * Every 250ms check the HID device list.
     * @private
     */
    private async uhkDevicePoller(): Promise<void> {
        let savedState: DeviceConnectionState;

        while (true) {
            if (this._pollerAllowed) {
                this._uhkDevicePolling = true;
                try {

                    const state = await this.device.getDeviceConnectionStateAsync();
                    if (!isEqual(state, savedState)) {
                        const newState = cloneDeep(state);

                        if (state.hasPermission && state.zeroInterfaceAvailable) {
                            state.hardwareModules = await this.getHardwareModules(false);
                        } else {
                            state.hardwareModules = {
                                moduleInfos: [],
                                rightModuleInfo: {}
                            };
                        }
                        this.win.webContents.send(IpcEvents.device.deviceConnectionStateChanged, state);

                        savedState = newState;

                        this.logService.misc('[DeviceService] Device connection state changed to:', state);
                    }
                } catch (err) {
                    this.logService.error('[DeviceService] Device connection state query error', err);
                }
            }

            this._uhkDevicePolling = false;
            await snooze(250);
        }
    }

    private async saveUserConfiguration(event: Electron.IpcMainEvent, args: Array<string>): Promise<void> {
        const response = new IpcResponse();
        const data: SaveUserConfigurationData = JSON.parse(args[0]);

        try {
            await this.stopPollUhkDevice();
            await backupUserConfiguration(data);

            this.logService.config('[DeviceService] User configuration will be saved', data.configuration);
            const buffer = mapObjectToUserConfigBinaryBuffer(data.configuration);
            await this.operations.saveUserConfiguration(buffer);

            if (data.saveInHistory) {
                await saveUserConfigHistoryAsync(buffer);
                await this.loadUserConfigFromHistory(event);
            }

            response.success = true;
        } catch (error) {
            this.logService.error('[DeviceService] Transferring error', error);
            response.error = { message: error.message };
        } finally {
            this.device.close();
            this.startPollUhkDevice();
        }

        event.sender.send(IpcEvents.device.saveUserConfigurationReply, response);

        return Promise.resolve();
    }

    private getDefaultFirmwarePathData(): TmpFirmware {
        return {
            packageJsonPath: this.getPackageJsonFirmwarePath(),
            tmpDirectory: path.join(this.rootDir, 'packages/firmware')
        };
    }

    private getPackageJsonFirmwarePath(): string {
        const packageJsonPath = path.join(this.rootDir, 'packages/firmware/package.json');

        if (fs.existsSync(packageJsonPath)) {
            return packageJsonPath;
        }

        throw new Error(`Could not found package.json of firmware ${packageJsonPath}`);
    }

    private async getUserConfigFromHistory(event: Electron.IpcMainEvent, [filename]): Promise<void> {
        const response: UploadFileData = {
            filename,
            data: await getUserConfigFromHistoryAsync(filename),
            saveInHistory: false
        };

        event.sender.send(IpcEvents.device.getUserConfigFromHistoryReply, response);
    }

    private async loadUserConfigFromHistory(event: Electron.IpcMainEvent): Promise<void> {
        const files = await loadUserConfigHistoryAsync();

        event.sender.send(IpcEvents.device.loadUserConfigHistoryReply, files);
    }
}

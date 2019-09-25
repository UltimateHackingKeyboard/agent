import { ipcMain } from 'electron';
import { isEqual } from 'lodash';
import {
    CommandLineArgs,
    ConfigurationReply,
    DeviceConnectionState,
    FirmwareUpgradeIpcResponse,
    getHardwareConfigFromDeviceResponse,
    HardwareModules,
    IpcEvents,
    IpcResponse,
    LogService,
    mapObjectToUserConfigBinaryBuffer,
    SaveUserConfigurationData,
    UpdateFirmwareData
} from 'uhk-common';
import { snooze, UhkHidDevice, UhkOperations } from 'uhk-usb';
import { emptyDir } from 'fs-extra';
import * as path from 'path';
import { platform } from 'os';

import { TmpFirmware } from '../models/tmp-firmware';
import { QueueManager } from './queue-manager';
import {
    backupUserConfiguration,
    getBackupUserConfigurationContent,
    getPackageJsonFromPathAsync,
    saveTmpFirmware
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
                private rootDir: string,
                private options: CommandLineArgs) {
        this.startPollUhkDevice();
        this.uhkDevicePoller()
            .catch(error => {
                this.logService.error('[DeviceService] UHK Device poller error', error);
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

        ipcMain.on(IpcEvents.device.enableUsbStackTest, (...args: any[]) => {
            this.queueManager.add({
                method: this.enableUsbStackTest,
                bind: this,
                params: args,
                asynchronous: true
            });
        });

        logService.debug('[DeviceService] init success');
    }

    /**
     * Return with the actual UserConfiguration from UHK Device
     * @returns {Promise<Buffer>}
     */
    public async loadConfigurations(event: Electron.Event): Promise<void> {
        let response: ConfigurationReply;

        try {
            await this.stopPollUhkDevice();

            await this.device.waitUntilKeyboardBusy();
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
            await this.device.waitUntilKeyboardBusy();

            return {
                leftModuleInfo: await this.operations.getLeftModuleVersionInfo(),
                rightModuleInfo: await this.operations.getRightModuleVersionInfo()
            };
        } catch (err) {
            if (!catchError) {
                return err;
            }

            this.logService.error('[DeviceService] Read hardware modules information failed', err);

            return {
                leftModuleInfo: {},
                rightModuleInfo: {}
            };
        }
    }

    public async close(): Promise<void> {
        await this.stopPollUhkDevice();
        this.logService.info('[DeviceService] Device connection checker stopped.');
    }

    public async updateFirmware(event: Electron.Event, args?: Array<string>): Promise<void> {
        const response = new FirmwareUpgradeIpcResponse();
        const data: UpdateFirmwareData = JSON.parse(args[0]);

        let firmwarePathData: TmpFirmware;

        try {
            this.logService.debug('Agent version:', data.versionInformation.version);
            const hardwareModules = await this.getHardwareModules(false);
            this.logService.debug('Device right firmware version:', hardwareModules.rightModuleInfo.firmwareVersion);
            this.logService.debug('Device left firmware version:', hardwareModules.leftModuleInfo.firmwareVersion);

            await this.stopPollUhkDevice();
            this.device.resetDeviceCache();

            if (data.firmware) {
                firmwarePathData = await saveTmpFirmware(data.firmware);

                const packageJson = await getPackageJsonFromPathAsync(firmwarePathData.packageJsonPath);
                this.logService.debug('New firmware version:', packageJson.firmwareVersion);

                if (this.useKboot()) {
                    await this.operations.updateRightFirmwareWithKboot(firmwarePathData.rightFirmwarePath);
                    await this.operations.updateLeftModuleWithKboot(firmwarePathData.leftFirmwarePath);
                } else {
                    await this.operations.updateRightFirmwareWithBlhost(firmwarePathData.rightFirmwarePath);
                    await this.operations.updateLeftModuleWithBlhost(firmwarePathData.leftFirmwarePath);
                }
            } else {
                const packageJsonPath = path.join(this.rootDir, 'packages/firmware/package.json');
                const packageJson = await getPackageJsonFromPathAsync(packageJsonPath);
                this.logService.debug('New firmware version:', packageJson.firmwareVersion);

                if (this.useKboot()) {
                    await this.operations.updateRightFirmwareWithKboot();
                    await this.operations.updateLeftModuleWithKboot();
                } else {
                    await this.operations.updateRightFirmwareWithBlhost();
                    await this.operations.updateLeftModuleWithBlhost();
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

        if (firmwarePathData) {
            await emptyDir(firmwarePathData.tmpDirectory.name);
        }

        await snooze(500);

        this.startPollUhkDevice();

        event.sender.send(IpcEvents.device.updateFirmwareReply, response);
    }

    public async recoveryDevice(event: Electron.Event): Promise<void> {
        const response = new FirmwareUpgradeIpcResponse();

        try {
            await this.stopPollUhkDevice();

            if (this.useKboot()) {
                await this.operations.updateRightFirmwareWithKboot();
            } else {
                await this.operations.updateRightFirmwareWithBlhost();
            }

            response.modules = await this.getHardwareModules(false);
            response.success = true;
        } catch (error) {
            const err = { message: error.message, stack: error.stack };
            this.logService.error('[DeviceService] updateFirmware error', err);

            response.modules = await this.getHardwareModules(true);
            response.error = err;
        }

        await snooze(500);
        event.sender.send(IpcEvents.device.updateFirmwareReply, response);
    }

    public async enableUsbStackTest(event: Electron.Event) {
        await this.device.enableUsbStackTest();
    }

    private startPollUhkDevice(): void {
        this._pollerAllowed = true;
    }

    private async stopPollUhkDevice(): Promise<void> {
        return new Promise<void>(async resolve => {
            this._pollerAllowed = false;

            while (true) {
                if (!this._uhkDevicePolling) {
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
                        savedState = state;
                        this.win.webContents.send(IpcEvents.device.deviceConnectionStateChanged, state);
                        this.logService.info('[DeviceService] Device connection state changed to:', state);
                    }
                } catch (err) {
                    this.logService.error('[DeviceService] Device connection state query error', err);
                }
            }

            this._uhkDevicePolling = false;
            await snooze(250);
        }
    }

    private async saveUserConfiguration(event: Electron.Event, args: Array<string>): Promise<void> {
        const response = new IpcResponse();
        const data: SaveUserConfigurationData = JSON.parse(args[0]);

        try {
            await this.stopPollUhkDevice();
            await backupUserConfiguration(data);

            const buffer = mapObjectToUserConfigBinaryBuffer(data.configuration);
            await this.operations.saveUserConfiguration(buffer);

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

    private useKboot(): boolean {
        switch (this.options.usbDriver) {
            case 'blhost':
                return false;

            case 'kboot':
                return true;

            default:
                return platform() !== 'win32';
        }
    }
}

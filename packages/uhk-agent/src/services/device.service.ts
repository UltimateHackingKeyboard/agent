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
    UpdateFirmwareData,
    UploadFileData
} from 'uhk-common';
import { snooze, UhkHidDevice, UhkOperations } from 'uhk-usb';
import { emptyDir } from 'fs-extra';
import * as path from 'path';
import * as fs from 'fs';
import { platform } from 'os';

import { TmpFirmware } from '../models/tmp-firmware';
import { QueueManager } from './queue-manager';
import {
    backupUserConfiguration,
    getBackupUserConfigurationContent,
    getPackageJsonFromPathAsync, getUserConfigFromHistoryAsync, loadUserConfigHistoryAsync,
    sanityCheckFirmwareAsync,
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

        logService.debug('[DeviceService] init success');
    }

    /**
     * Return with the actual UserConfiguration from UHK Device
     * @returns {Promise<Buffer>}
     */
    public async loadConfigurations(event: Electron.IpcMainEvent): Promise<void> {
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

    public async updateFirmware(event: Electron.IpcMainEvent, args?: Array<string>): Promise<void> {
        const response = new FirmwareUpgradeIpcResponse();
        const data: UpdateFirmwareData = JSON.parse(args[0]);

        let firmwarePathData: TmpFirmware;

        try {
            firmwarePathData = data.uploadFile
                ? await saveTmpFirmware(data.uploadFile)
                : this.getDefaultFirmwarePathData();

            await sanityCheckFirmwareAsync(firmwarePathData);
            this.logService.debug('Agent version:', data.versionInformation.version);
            const hardwareModules = await this.getHardwareModules(false);
            this.logService.debug('Device right firmware version:', hardwareModules.rightModuleInfo.firmwareVersion);
            this.logService.debug('Device left firmware version:', hardwareModules.leftModuleInfo.firmwareVersion);

            await this.stopPollUhkDevice();
            this.device.resetDeviceCache();

            const packageJson = await getPackageJsonFromPathAsync(firmwarePathData.packageJsonPath);
            this.logService.debug('New firmware version:', packageJson.firmwareVersion);

            if (this.useKboot()) {
                await this.operations.updateRightFirmwareWithKboot(firmwarePathData.rightFirmwarePath);
                await this.operations.updateLeftModuleWithKboot(firmwarePathData.leftFirmwarePath);
            } else {
                await this.operations.updateRightFirmwareWithBlhost(firmwarePathData.rightFirmwarePath);
                await this.operations.updateLeftModuleWithBlhost(firmwarePathData.leftFirmwarePath);
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

    public async recoveryDevice(event: Electron.IpcMainEvent): Promise<void> {
        const response = new FirmwareUpgradeIpcResponse();

        try {
            const firmwarePathData: TmpFirmware = this.getDefaultFirmwarePathData();
            await sanityCheckFirmwareAsync(firmwarePathData);
            await this.stopPollUhkDevice();

            if (this.useKboot()) {
                await this.operations.updateRightFirmwareWithKboot(firmwarePathData.rightFirmwarePath);
            } else {
                await this.operations.updateRightFirmwareWithBlhost(firmwarePathData.rightFirmwarePath);
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

    public async readConfigSizes(event: Electron.IpcMainEvent): Promise<void> {
        const configSizes = await this.operations.getConfigSizesFromKeyboard();
        event.sender.send(IpcEvents.device.readConfigSizesReply, JSON.stringify(configSizes));
    }

    public startPollUhkDevice(): void {
        this.logService.info('[DeviceService] start poll UHK Device');
        this._pollerAllowed = true;
    }

    public async stopPollUhkDevice(): Promise<void> {
        this.logService.info('[DeviceService] stop poll UHK Device');
        return new Promise<void>(async resolve => {
            this._pollerAllowed = false;

            while (true) {
                if (!this._uhkDevicePolling) {
                    this.logService.info('[DeviceService] stopped poll UHK Device');
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

    private async saveUserConfiguration(event: Electron.IpcMainEvent, args: Array<string>): Promise<void> {
        const response = new IpcResponse();
        const data: SaveUserConfigurationData = JSON.parse(args[0]);

        try {
            await this.stopPollUhkDevice();
            await backupUserConfiguration(data);

            const buffer = mapObjectToUserConfigBinaryBuffer(data.configuration);
            await this.operations.saveUserConfiguration(buffer);

            if (data.saveInHistory) {
                await saveUserConfigHistoryAsync(buffer);
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

    private getDefaultFirmwarePathData(): TmpFirmware {
        return {
            leftFirmwarePath: this.getLeftModuleFirmwarePath(),
            rightFirmwarePath: this.getFirmwarePath(),
            packageJsonPath: this.getPackageJsonFirmwarePath(),
            tmpDirectory: path.join(this.rootDir, 'packages/firmware')
        };
    }

    private getFirmwarePath(): string {
        const firmware = path.join(this.rootDir, 'packages/firmware/devices/uhk60-right/firmware.hex');

        if (fs.existsSync(firmware)) {
            return firmware;
        }

        throw new Error(`Could not found firmware ${firmware}`);
    }

    private getLeftModuleFirmwarePath(): string {
        const firmware = path.join(this.rootDir, 'packages/firmware/modules/uhk60-left.bin');

        if (fs.existsSync(firmware)) {
            return firmware;
        }

        throw new Error(`Could not found left module firmware ${firmware}`);
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

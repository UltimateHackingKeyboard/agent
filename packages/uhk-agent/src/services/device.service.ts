import { ipcMain } from 'electron';
import {
    ConfigurationReply,
    DeviceConnectionState,
    FirmwareUpgradeIpcResponse,
    getHardwareConfigFromDeviceResponse,
    HardwareModules,
    IpcEvents,
    IpcResponse,
    LogService,
    mapObjectToUserConfigBinaryBuffer,
    SaveUserConfigurationData
} from 'uhk-common';
import { deviceConnectionStateComparer, snooze, UhkHidDevice, UhkOperations } from 'uhk-usb';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { emptyDir } from 'fs-extra';
import * as path from 'path';

import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/distinctUntilChanged';

import { TmpFirmware } from '../models/tmp-firmware';
import { QueueManager } from './queue-manager';
import {
    backupUserConfiguration,
    getBackupUserConfigurationContent,
    getPackageJsonFromPathAsync,
    saveTmpFirmware
} from '../util';
import { getVersions } from '../../../uhk-web/src/app/util';

/**
 * IpcMain pair of the UHK Communication
 * Functionality:
 * - Send UserConfiguration to the UHK Device
 * - Read UserConfiguration from the UHK Device
 */
export class DeviceService {
    private pollTimer$: Subscription;
    private queueManager = new QueueManager();

    constructor(private logService: LogService,
                private win: Electron.BrowserWindow,
                private device: UhkHidDevice,
                private operations: UhkOperations,
                private rootDir: string) {
        this.pollUhkDevice();

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

        ipcMain.on(IpcEvents.device.startConnectionPoller, this.pollUhkDevice.bind(this));

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
        }
        catch (err) {
            if (!catchError) {
                return err;
            }

            this.logService.error('[DeviceService] Read hardware modules information failed', err);
        }
    }

    public close(): void {
        this.stopPollTimer();
        this.logService.info('[DeviceService] Device connection checker stopped.');
    }

    public async updateFirmware(event: Electron.Event, args?: Array<string>): Promise<void> {
        const response = new FirmwareUpgradeIpcResponse();

        let firmwarePathData: TmpFirmware;

        try {
            this.logService.debug('Agent version:', getVersions().version);
            const hardwareModules = await this.getHardwareModules(false);
            this.logService.debug('Device right firmware version:', hardwareModules.rightModuleInfo.firmwareVersion);
            this.logService.debug('Device left firmware version:', hardwareModules.leftModuleInfo.firmwareVersion);

            this.device.resetDeviceCache();
            this.stopPollTimer();

            if (args && args.length > 0) {
                firmwarePathData = await saveTmpFirmware(args[0]);

                const packageJson = await getPackageJsonFromPathAsync(firmwarePathData.packageJsonPath);
                this.logService.debug('New firmware version:', packageJson.firmwareVersion);

                await this.operations.updateRightFirmware(firmwarePathData.rightFirmwarePath);
                await this.operations.updateLeftModule(firmwarePathData.leftFirmwarePath);
            }
            else {
                const packageJsonPath = path.join(this.rootDir, 'packages/firmware/package.json');
                const packageJson = await getPackageJsonFromPathAsync(packageJsonPath);
                this.logService.debug('New firmware version:', packageJson.firmwareVersion);

                await this.operations.updateRightFirmware();
                await this.operations.updateLeftModule();
            }

            response.success = true;
            response.modules = await this.getHardwareModules(false);
        } catch (error) {
            const err = {message: error.message, stack: error.stack};
            this.logService.error('[DeviceService] updateFirmware error', err);

            response.modules = await this.getHardwareModules(true);
            response.error = err;
        }

        if (firmwarePathData) {
            await emptyDir(firmwarePathData.tmpDirectory.name);
        }

        await snooze(500);

        this.pollUhkDevice();

        event.sender.send(IpcEvents.device.updateFirmwareReply, response);
    }

    public async recoveryDevice(event: Electron.Event): Promise<void> {
        const response = new FirmwareUpgradeIpcResponse();

        try {
            this.stopPollTimer();

            await this.operations.updateRightFirmware();

            await snooze(500);

            this.pollUhkDevice();

            response.modules = await this.getHardwareModules(false);
            response.success = true;
        } catch (error) {
            const err = {message: error.message, stack: error.stack};
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

    /**
     * HID API not support device attached and detached event.
     * This method check the keyboard is attached to the computer or not.
     * Every second check the HID device list.
     * @private
     */
    private pollUhkDevice(): void {
        if (this.pollTimer$) {
            return;
        }

        this.pollTimer$ = Observable.interval(1000)
            .startWith(0)
            .map(() => this.device.getDeviceConnectionState())
            .distinctUntilChanged<DeviceConnectionState>(deviceConnectionStateComparer)
            .do((state: DeviceConnectionState) => {
                this.win.webContents.send(IpcEvents.device.deviceConnectionStateChanged, state);
                this.logService.info('[DeviceService] Device connection state changed to:', state);
            })
            .subscribe();
    }

    private async saveUserConfiguration(event: Electron.Event, args: Array<string>): Promise<void> {
        const response = new IpcResponse();
        const data: SaveUserConfigurationData = JSON.parse(args[0]);

        try {
            await backupUserConfiguration(data);

            const buffer = mapObjectToUserConfigBinaryBuffer(data.configuration);
            await this.operations.saveUserConfiguration(buffer);

            response.success = true;
        }
        catch (error) {
            this.logService.error('[DeviceService] Transferring error', error);
            response.error = {message: error.message};
        } finally {
            this.device.close();
        }

        event.sender.send(IpcEvents.device.saveUserConfigurationReply, response);

        return Promise.resolve();
    }

    private stopPollTimer(): void {
        if (!this.pollTimer$) {
            return;
        }

        this.pollTimer$.unsubscribe();
        this.pollTimer$ = null;

    }
}

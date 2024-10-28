import { ipcMain } from 'electron';
import { emptyDir } from 'fs-extra';
import { cloneDeep, isEqual } from 'lodash';
import os from 'os';
import {
    BackupUserConfigurationInfo,
    ChangeKeyboardLayoutIpcResponse,
    CommandLineArgs,
    ConfigurationReply,
    convertBleAddressArrayToString,
    convertBleStringToNumberArray,
    DeviceConnectionState,
    disableAgentUpgradeProtection,
    findUhkModuleById,
    FIRMWARE_UPGRADE_METHODS,
    FirmwareUpgradeFailReason,
    FirmwareUpgradeIpcResponse,
    getHardwareConfigFromDeviceResponse,
    getUserConfigFromDeviceResponse,
    HardwareConfiguration,
    HardwareModules,
    IpcEvents,
    IpcResponse,
    isDeviceProtocolSupportFirmwareChecksum,
    isDeviceProtocolSupportGitInfo,
    isDeviceProtocolSupportStatusError,
    isSameFirmware,
    KeyboardLayout,
    LEFT_HALF_MODULE,
    LeftSlotModules,
    LogService,
    mapObjectToUserConfigBinaryBuffer,
    ModuleInfo,
    ModuleSlotToId,
    RIGHT_HALF_FIRMWARE_UPGRADE_MODULE_NAME,
    RightSlotModules,
    SaveUserConfigurationData,
    shouldUpgradeAgent,
    shouldUpgradeFirmware,
    simulateInvalidUserConfigError,
    UHK_80_DEVICE_LEFT,
    UHK_DONGLE,
    UHK_MODULES,
    UpdateFirmwareData,
    UploadFileData,
    VersionInformation
} from 'uhk-common';
import {
    checkFirmwareAndDeviceCompatibility,
    ConfigBufferId,
    convertBufferToIntArray,
    DevicePropertyIds,
    EnumerationModes,
    getCurrentUhkDeviceProduct,
    getCurrentUhkDeviceProductByBootloaderId,
    getCurrentUhkDongleHID,
    getCurrenUhk80LeftHID,
    getDeviceFirmwarePath,
    getFirmwarePackageJson,
    getModuleFirmwarePath,
    isUhkDeviceConnected,
    isUkhKeyboardConnected,
    readUhkResponseAs0EndString,
    snooze,
    TmpFirmware,
    UhkHidDevice,
    UhkOperations,
    usbDeviceJsonFormatter,
    UsbVariables,
    waitForDevices,
    waitForUhkDeviceConnected,
    waitUntil,
} from 'uhk-usb';
import {
    backupUserConfiguration,
    copySmartMacroDocToWebserver,
    getBackupUserConfigurationContent,
    getDefaultFirmwarePath,
    getSmartMacroDocRootPath,
    getUserConfigFromHistoryAsync,
    loadUserConfigHistoryAsync,
    makeFolderWriteableToUserOnLinux,
    saveTmpFirmware,
    saveUserConfigHistoryAsync
} from '../util';

import { QueueManager } from './queue-manager';

/**
 * IpcMain pair of the UHK Communication
 * Functionality:
 * - Send UserConfiguration to the UHK Device
 * - Read UserConfiguration from the UHK Device
 */
export class DeviceService {
    private _pollerAllowed: boolean;
    private _uhkDevicePolling: boolean;
    private _checkStatusBuffer: boolean;
    private queueManager = new QueueManager();
    private wasCalledSaveUserConfiguration = false;
    private isI2cDebuggingEnabled = false;
    private i2cWatchdogRecoveryCounter = -1;
    private savedState: DeviceConnectionState;


    constructor(private logService: LogService,
                private win: Electron.BrowserWindow,
                private device: UhkHidDevice,
                private operations: UhkOperations,
                private options: CommandLineArgs,
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

        ipcMain.on(IpcEvents.device.changeKeyboardLayout, (...args: any[]) => {
            this.queueManager.add({
                method: this.changeKeyboardLayout,
                bind: this,
                params: args,
                asynchronous: true
            });
        });

        ipcMain.on(IpcEvents.device.deleteHostConnection, (...args: any[]) => {
            this.queueManager.add({
                method: this.deleteHostConnection,
                bind: this,
                params: args,
                asynchronous: true
            });
        });

        ipcMain.on(IpcEvents.device.toggleI2cDebugging, this.toggleI2cDebugging.bind(this));

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

        ipcMain.on(IpcEvents.device.startDonglePairing, (...args: any[]) => {
            this.queueManager.add({
                method: this.startDonglePairing,
                bind: this,
                params: args,
                asynchronous: true
            });
        });

        ipcMain.on(IpcEvents.device.startLeftHalfPairing, (...args: any[]) => {
            this.queueManager.add({
                method: this.startLeftHalfPairing,
                bind: this,
                params: args,
                asynchronous: true
            });
        });


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
    public async loadConfigurations(event: Electron.IpcMainEvent, args: Array<any>): Promise<void> {
        this.logService.misc('[DeviceService] load user configuration');
        const versionInformation: VersionInformation = args[0];

        let response: ConfigurationReply;

        try {
            await this.stopPollUhkDevice();

            await this.operations.waitUntilKeyboardBusy();
            const result = await this.operations.loadConfigurations();
            const modules: HardwareModules = await this.getHardwareModules(false);

            const hardwareConfig = getHardwareConfigFromDeviceResponse(result.hardwareConfiguration);
            const uniqueId = hardwareConfig.uniqueId;

            if (simulateInvalidUserConfigError(this.options) && !this.wasCalledSaveUserConfiguration) {
                result.userConfiguration = 'invalid user config';
            }

            let isUserConfigInvalid = false;
            try {
                getUserConfigFromDeviceResponse(result.userConfiguration);
            } catch {
                isUserConfigInvalid = true;
            }

            response = {
                success: true,
                ...result,
                modules,
                backupConfiguration: isUserConfigInvalid
                    ? await getBackupUserConfigurationContent(this.logService, uniqueId, versionInformation)
                    : {
                        info: BackupUserConfigurationInfo.Unknown
                    }
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

            const hardwareModules: HardwareModules = {
                moduleInfos: [],
                rightModuleInfo: await this.operations.getRightModuleVersionInfo()
            };

            const isGitInfoSupported = isDeviceProtocolSupportGitInfo(hardwareModules.rightModuleInfo.deviceProtocolVersion);
            const isFirmwareChecksumSupported = isDeviceProtocolSupportFirmwareChecksum(hardwareModules.rightModuleInfo.deviceProtocolVersion);
            const halvesStates = await this.device.getHalvesStates();

            const leftModuleInfo: ModuleInfo = {
                module: LEFT_HALF_MODULE,
                info: {}
            };
            hardwareModules.moduleInfos.push(leftModuleInfo);

            if (halvesStates.isLeftHalfConnected) {
                leftModuleInfo.info = await this.operations.getModuleVersionInfo(
                    LEFT_HALF_MODULE.slotId,
                    isGitInfoSupported,
                    isFirmwareChecksumSupported
                );
            }

            if (halvesStates.leftModuleSlot !== LeftSlotModules.NoModule) {
                const module = findUhkModuleById(halvesStates.leftModuleSlot);

                hardwareModules.moduleInfos.push({
                    module: module,
                    info: await this.operations.getModuleVersionInfo(module.slotId, isGitInfoSupported, isFirmwareChecksumSupported)
                });
            }

            if (halvesStates.rightModuleSlot !== RightSlotModules.NoModule) {
                const module = findUhkModuleById(halvesStates.rightModuleSlot);

                hardwareModules.moduleInfos.push({
                    module: module,
                    info: await this.operations.getModuleVersionInfo(module.slotId, isGitInfoSupported, isFirmwareChecksumSupported)
                });
            }

            if (isFirmwareChecksumSupported) {
                for (const moduleInfo of hardwareModules.moduleInfos) {
                    const moduleId = moduleInfo.module.id;
                    const md5 = readUhkResponseAs0EndString(await this.operations.getRightModuleProperty(DevicePropertyIds.FirmwareChecksum, [moduleId]));
                    hardwareModules.rightModuleInfo.modules[moduleId] = {
                        md5
                    };
                }
            }
            return hardwareModules;
        } catch (err) {
            if (!catchError) {
                throw err;
            }

            this.logService.error('[DeviceService] Read hardware modules information failed', err);

            return {
                moduleInfos: [],
                rightModuleInfo: {
                    modules: {}
                }
            };
        }
    }

    public async close(): Promise<void> {
        await this.stopPollUhkDevice();
        this.logService.misc('[DeviceService] Device connection checker stopped.');
    }

    public async updateFirmware(event: Electron.IpcMainEvent, args?: Array<string>): Promise<void> {
        const response = new FirmwareUpgradeIpcResponse();
        response.userConfigSaved = false;
        response.firmwareDowngraded = false;
        const data: UpdateFirmwareData = JSON.parse(args[0]);
        let firmwarePathData: TmpFirmware;

        try {
            firmwarePathData = data.uploadFile
                ? await saveTmpFirmware(data.uploadFile)
                : getDefaultFirmwarePath(this.rootDir);

            const packageJson = await getFirmwarePackageJson(firmwarePathData);
            this.logService.misc(`[DeviceService] Operating system: ${os.type()} ${os.release()} ${os.arch()}`);
            this.logService.misc('[DeviceService] Agent version:', data.versionInformation.version);
            this.logService.misc('[DeviceService] New firmware version:', packageJson.firmwareVersion);
            this.logService.misc('[DeviceService] New firmware user config version:', packageJson.userConfigVersion);

            event.sender.send(IpcEvents.device.updateFirmwareJson, packageJson);

            const uhkDeviceProduct = await getCurrentUhkDeviceProduct(this.options);
            checkFirmwareAndDeviceCompatibility(packageJson, uhkDeviceProduct);
            const disableAgentUpgrade = disableAgentUpgradeProtection(this.options);
            if (shouldUpgradeAgent(packageJson.userConfigVersion, disableAgentUpgrade, data.versionInformation?.userConfigVersion)) {
                response.failReason = FirmwareUpgradeFailReason.UserConfigVersionNotSupported;
                this.logService.error(`[DeviceService] Firmware contains newer ${packageJson.userConfigVersion} user config version than what Agent supports`);

                return event.sender.send(IpcEvents.device.updateFirmwareReply, response);
            }
            await this.stopPollUhkDevice();

            let hardwareModules = await this.getHardwareModules(false);

            this.logService.misc('[DeviceService] UHK Device firmware upgrade starts:',
                JSON.stringify(uhkDeviceProduct, usbDeviceJsonFormatter));
            const deviceFirmwarePath = getDeviceFirmwarePath(uhkDeviceProduct, packageJson);

            this.logService.misc('[DeviceService] Device right firmware version:',
                hardwareModules.rightModuleInfo.firmwareVersion);
            if (data.forceUpgrade || hardwareModules.rightModuleInfo.firmwareVersion !== packageJson.firmwareVersion) {
                event.sender.send(IpcEvents.device.moduleFirmwareUpgrading, RIGHT_HALF_FIRMWARE_UPGRADE_MODULE_NAME);
                await this.operations.updateDeviceFirmware(deviceFirmwarePath, uhkDeviceProduct);
                this.logService.misc('[DeviceService] Waiting for keyboard');
                await waitForDevices(uhkDeviceProduct.keyboard);
                hardwareModules = await this.getHardwareModules(false);
                event.sender.send(IpcEvents.device.hardwareModulesLoaded, hardwareModules);

                if(shouldUpgradeFirmware(packageJson.userConfigVersion, data.versionInformation)) {
                    this.logService.misc('[DeviceService] Skip user config saving because user config version is newer than what firmware supports');
                    response.firmwareDowngraded = true;
                } else {
                    this.logService.misc('[DeviceService] User configuration will be saved after right module firmware upgrade');
                    this.logService.config('[DeviceService] User configuration', data.userConfig);
                    const buffer = mapObjectToUserConfigBinaryBuffer(data.userConfig);
                    await this.operations.saveUserConfiguration(buffer);
                    this._checkStatusBuffer = true;
                    response.userConfigSaved = true;
                }
            } else {
                this.logService.misc('Skip right firmware upgrade.');
            }

            const leftModuleInfo: ModuleInfo = hardwareModules.moduleInfos
                .find(moduleInfo => moduleInfo.module.slotId === ModuleSlotToId.leftHalf);
            const leftModuleFirmwareInfo = hardwareModules.rightModuleInfo.modules[leftModuleInfo.module.id];

            this.logService.misc('[DeviceService] Left module firmware version: ', leftModuleInfo.info.firmwareVersion);
            this.logService.misc('[DeviceService] Current left module firmware checksum: ', leftModuleInfo.info.firmwareChecksum);
            if (leftModuleFirmwareInfo) {
                this.logService.misc('[DeviceService] New left module firmware checksum: ', leftModuleFirmwareInfo.md5);
            }

            const isLeftModuleFirmwareSame = isSameFirmware(
                leftModuleInfo.info,
                {
                    firmwareChecksum: leftModuleFirmwareInfo?.md5,
                    firmwareVersion: packageJson.firmwareVersion
                }
            );

            if (data.forceUpgrade || !isLeftModuleFirmwareSame) {
                event.sender.send(IpcEvents.device.moduleFirmwareUpgrading, leftModuleInfo.module.name);

                if(uhkDeviceProduct.firmwareUpgradeMethod === FIRMWARE_UPGRADE_METHODS.MCUBOOT) {
                    if (!(await isUhkDeviceConnected(UHK_80_DEVICE_LEFT))) {
                        this.logService.misc('[DeviceService] To continue the firmware upgrade, now connect the left half via USB. (You can disconnect the right half or use a second USB cable.)');
                    }

                    await waitForUhkDeviceConnected(UHK_80_DEVICE_LEFT);
                    await snooze(1000);
                    const firmwarePath = getDeviceFirmwarePath(UHK_80_DEVICE_LEFT, packageJson);
                    await this.operations.updateFirmwareWithMcuManager(firmwarePath, UHK_80_DEVICE_LEFT);

                    if (!(await isUhkDeviceConnected(uhkDeviceProduct))) {
                        this.logService.misc('[DeviceService] To finish the firmware upgrade, now connect the right half via USB. (You can disconnect the left half or use a second USB cable.)');
                    }

                    await waitForUhkDeviceConnected(uhkDeviceProduct);
                }
                else {
                    await this.operations
                        .updateModuleWithKboot(
                            getModuleFirmwarePath(leftModuleInfo.module, packageJson),
                            uhkDeviceProduct,
                            leftModuleInfo.module
                        );
                }
            } else {
                event.sender.send(IpcEvents.device.moduleFirmwareUpgradeSkip, leftModuleInfo.module.name);
                this.logService.misc('[DeviceService] Skip left firmware upgrade.');
            }

            // TODO: implement MCUBOOT version
            if (uhkDeviceProduct.firmwareUpgradeMethod === FIRMWARE_UPGRADE_METHODS.KBOOT) {
                for (const moduleInfo of hardwareModules.moduleInfos) {
                    if (moduleInfo.module.slotId === ModuleSlotToId.leftHalf) {
                        // Left half upgrade mandatory, it is running before the other modules upgrade.
                    } else if (moduleInfo.module.firmwareUpgradeSupported) {
                        this.logService.misc(`[DeviceService] "${moduleInfo.module.name}" firmware version:`, moduleInfo.info.firmwareVersion);
                        this.logService.misc(`[DeviceService] "${moduleInfo.module.name}" current firmware checksum:`, moduleInfo.info.firmwareChecksum);

                        const moduleFirmwareInfo = hardwareModules.rightModuleInfo.modules[moduleInfo.module.id];
                        if (moduleFirmwareInfo) {
                            this.logService.misc(`[DeviceService] "${moduleInfo.module.name}" new firmware checksum:`, moduleFirmwareInfo.md5);
                        }

                        const isModuleFirmwareSame = isSameFirmware(
                            moduleInfo.info,
                            {
                                firmwareChecksum: moduleFirmwareInfo?.md5,
                                firmwareVersion: packageJson.firmwareVersion
                            }
                        );

                        if (data.forceUpgrade || !isModuleFirmwareSame) {
                            event.sender.send(IpcEvents.device.moduleFirmwareUpgrading, moduleInfo.module.name);
                            await this.operations
                                .updateModuleWithKboot(
                                    getModuleFirmwarePath(moduleInfo.module, packageJson),
                                    uhkDeviceProduct,
                                    moduleInfo.module
                                );
                            this.logService.misc(`[DeviceService] "${moduleInfo.module.name}" firmware update done.`);
                        } else {
                            event.sender.send(IpcEvents.device.moduleFirmwareUpgradeSkip, moduleInfo.module.name);
                            this.logService.misc(`[DeviceService] Skip "${moduleInfo.module.name}" firmware upgrade.`);
                        }
                    } else {
                        this.logService.misc(`[DeviceService] Skip "${moduleInfo.module.name}" firmware upgrade. Currently not supported`);
                    }
                }
            }

            response.modules = await this.getHardwareModules(false);
            await copySmartMacroDocToWebserver(firmwarePathData, this.logService);
            await makeFolderWriteableToUserOnLinux(getSmartMacroDocRootPath());
            response.success = true;
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
            const userConfig = args[0];
            const firmwarePathData: TmpFirmware = getDefaultFirmwarePath(this.rootDir);
            const packageJson = await getFirmwarePackageJson(firmwarePathData);
            await this.stopPollUhkDevice();

            const uhkDeviceProduct = await getCurrentUhkDeviceProductByBootloaderId();
            checkFirmwareAndDeviceCompatibility(packageJson, uhkDeviceProduct);

            this.logService.misc(
                '[DeviceService] UHK Device recovery starts:',
                JSON.stringify(uhkDeviceProduct, usbDeviceJsonFormatter));
            const deviceFirmwarePath = getDeviceFirmwarePath(uhkDeviceProduct, packageJson);

            await this.operations.updateDeviceFirmware(deviceFirmwarePath, uhkDeviceProduct);

            this.logService.misc('[DeviceService] Waiting for keyboard');
            await waitForDevices(uhkDeviceProduct.keyboard);

            this.logService.config(
                '[DeviceService] User configuration will be saved after right module recovery',
                userConfig);
            const buffer = mapObjectToUserConfigBinaryBuffer(userConfig);
            await this.operations.saveUserConfiguration(buffer);
            this._checkStatusBuffer = true;

            response.modules = await this.getHardwareModules(false);
            await copySmartMacroDocToWebserver(firmwarePathData, this.logService);
            await makeFolderWriteableToUserOnLinux(getSmartMacroDocRootPath());
            response.success = true;
            response.userConfigSaved = true;
            response.firmwareDowngraded = false;
        } catch (error) {
            const err = { message: error.message, stack: error.stack };
            this.logService.error('[DeviceService] updateFirmware error', err);

            response.modules = {
                moduleInfos: [],
                rightModuleInfo: {
                    modules: {},
                }
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
            const firmwarePathData: TmpFirmware = getDefaultFirmwarePath(this.rootDir);
            const packageJson = await getFirmwarePackageJson(firmwarePathData);
            await this.stopPollUhkDevice();

            const uhkDeviceProduct = await getCurrentUhkDeviceProduct(this.options);
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

    public async deleteHostConnection(event: Electron.IpcMainEvent, args: Array<any>): Promise<void> {
        const {isConnectedDongleAddress, index, address} = args[0];
        this.logService.misc('[DeviceService] delete host connection', { isConnectedDongleAddress, index, address });

        try {
            await this.stopPollUhkDevice();
            const dongleHid = await getCurrentUhkDongleHID();
            let dongleUhkDevice: UhkHidDevice;
            try {
                dongleUhkDevice = new UhkHidDevice(this.logService, this.options, this.rootDir, dongleHid);
                await dongleUhkDevice.deleteAllBonds();
                await this.device.deleteBond(convertBleStringToNumberArray(address));
                this.logService.misc('[DeviceService] delete host connection success', { address });
                await snooze(1000);
                event.sender.send(IpcEvents.device.deleteHostConnectionSuccess, {index, address});
            }
            finally {
                if (dongleUhkDevice) {
                    dongleUhkDevice.close();
                }
            }
        } catch (error) {
            if (isConnectedDongleAddress) {
                await this.forceReenumerateDongle();
            }
            await this.forceReenumerateDevice();
            this.logService.misc('[DeviceService] delete host connection failed', { address, error });
            event.sender.send(IpcEvents.device.deleteHostConnectionFailed, error.message);
        }
        finally {
            this.savedState = undefined;
            this.startPollUhkDevice();
        }
    }

    public async startDonglePairing(event: Electron.IpcMainEvent): Promise<void> {
        this.logService.misc('[DeviceService] start Dongle pairing');
        try {
            await this.stopPollUhkDevice();
            const dongleHid = await getCurrentUhkDongleHID();
            let dongleUhkDevice: UhkHidDevice;
            try {
                dongleUhkDevice = new UhkHidDevice(this.logService, this.options, this.rootDir, dongleHid);
                const result = await this.operations.pairToDongle(dongleUhkDevice);
                this.logService.misc('[DeviceService] Dongle pairing success');
                await snooze(1000);
                event.sender.send(IpcEvents.device.donglePairingSuccess, result.pairAddress);
            }
            finally {
                if(dongleUhkDevice) {
                    dongleUhkDevice.close();
                }
            }
        }
        catch(error) {
            this.logService.error('[DeviceService] Dongle pairing failed', error);
            await this.forceReenumerateDongle();
            await this.forceReenumerateDevice();
            event.sender.send(IpcEvents.device.donglePairingFailed, error.message);
        }
        finally {
            this.savedState = undefined;
            this.startPollUhkDevice();
        }
    }

    public async startLeftHalfPairing(event: Electron.IpcMainEvent): Promise<void> {
        this.logService.misc('[DeviceService] start Left half pairing');

        try {
            await this.stopPollUhkDevice();
            if (!(await isUkhKeyboardConnected(UHK_80_DEVICE_LEFT))) {
                this.logService.misc('[DeviceService] Both keyboard halves must be connected via USB.');
                this.logService.misc('[DeviceService] Please connect them and retry pairing the halves.');
                event.sender.send(IpcEvents.device.leftHalfPairingFailed, '');

                return;
            }

            await waitUntil({
                shouldWait: async () => !(await isUkhKeyboardConnected(UHK_80_DEVICE_LEFT)),
                wait: 250,
            });

            await snooze(1000);
            const leftHalfHid = await getCurrenUhk80LeftHID();
            let leftHalfDevice: UhkHidDevice;
            try {
                leftHalfDevice = new UhkHidDevice(this.logService, this.options, this.rootDir, leftHalfHid);
                const result = await this.operations.pairToLeftHalf(leftHalfDevice);
                this.logService.misc('[DeviceService] Pairing the keyboard halves succeeded.');
                await snooze(1000);
                event.sender.send(IpcEvents.device.leftHalfPairingSuccess, result.pairAddress);
            }
            finally {
                if (leftHalfDevice) {
                    leftHalfDevice.close();
                }
            }

        } catch(error) {
            this.logService.error('[DeviceService] Left half pairing failed', error);
            await this.forceReenumerateDevice();
            await this.forceReenumerateLeftHalf();
            event.sender.send(IpcEvents.device.leftHalfPairingFailed, error.message);
        }
        finally {
            this.savedState = undefined;
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

    private async changeKeyboardLayout(event: Electron.IpcMainEvent, args): Promise<void> {
        const layout: KeyboardLayout = args[0];
        const hardwareConfiguration: HardwareConfiguration = new HardwareConfiguration().fromJsonObject(args[1]);
        const layoutName = layout === KeyboardLayout.ISO ? 'iso': 'ansi';

        this.logService.misc(`[DeviceService] Change keyboard layout to ${layoutName}`);
        const response = new ChangeKeyboardLayoutIpcResponse();

        try {
            await this.stopPollUhkDevice();

            await this.operations.saveHardwareConfiguration(layout === KeyboardLayout.ISO, hardwareConfiguration.deviceId, hardwareConfiguration.uniqueId);

            const hardwareInfo = await this.operations.loadConfiguration(ConfigBufferId.hardwareConfig);
            response.hardwareConfig = JSON.stringify(convertBufferToIntArray(hardwareInfo));
            response.success = true;

            this.logService.misc('[DeviceService] Keyboard layout changed to', layoutName);
        } catch (error) {
            this.logService.error('[DeviceService] Change keyboard  layout error', error);

            response.success = false;
            response.error = { message: error.message };
        } finally {
            this.startPollUhkDevice();
        }

        event.sender.send(IpcEvents.device.changeKeyboardLayoutReply, response);
    }

    private async checkStatusBuffer(deviceProtocolVersion: string): Promise<void> {
        if (!this._checkStatusBuffer) {
            return;
        }

        this._checkStatusBuffer = false;

        if (!isDeviceProtocolSupportStatusError(deviceProtocolVersion)) {
            return;
        }

        const message = await this.operations.getVariable(UsbVariables.statusBuffer);
        this.win.webContents.send(IpcEvents.device.statusBufferChanged, message);
    }

    /**
     * HID API not support device attached and detached event.
     * This method check the keyboard is attached to the computer or not.
     * The halves are connected and merged or not.
     * Every 250ms check the HID device list.
     * @private
     */
    private async uhkDevicePoller(): Promise<void> {
        let deviceProtocolVersion: string;
        let iterationCount = 0;

        while (true) {
            if (this._pollerAllowed) {
                this._uhkDevicePolling = true;
                iterationCount++;

                try {
                    const state = await this.device.getDeviceConnectionStateAsync();
                    if (!isEqual(state, this.savedState)) {
                        const newState = cloneDeep(state);

                        if (state.hasPermission && state.communicationInterfaceAvailable) {
                            state.hardwareModules = await this.getHardwareModules(false);
                            deviceProtocolVersion = state.hardwareModules.rightModuleInfo.deviceProtocolVersion;
                            const isDeviceSupportWirelessUSBCommands = await this.device.isDeviceSupportWirelessUSBCommands();
                            let deviceBleAddress: number[];
                            if (isDeviceSupportWirelessUSBCommands) {
                                deviceBleAddress = await this.device.getBleAddress();
                                state.bleAddress = convertBleAddressArrayToString(deviceBleAddress);
                            }

                            if (isDeviceSupportWirelessUSBCommands && !state.dongle.multiDevice && state.dongle.serialNumber && state.dongle.serialNumber !== this.savedState?.dongle?.serialNumber) {
                                const dongle = await getCurrentUhkDongleHID();
                                let dongleUhkDevice: UhkHidDevice;
                                try {
                                    dongleUhkDevice = new UhkHidDevice(this.logService, this.options, this.rootDir, dongle);
                                    const dongleBleAddress = await dongleUhkDevice.getBleAddress();
                                    state.dongle.bleAddress = convertBleAddressArrayToString(dongleBleAddress);
                                    state.dongle.isPairedWithKeyboard = await dongleUhkDevice.isPairedWith(deviceBleAddress);
                                    state.isPairedWithDongle = await this.device.isPairedWith(dongleBleAddress);
                                }
                                catch (err) {
                                    this.logService.error("Can't query Dongle BLE Addresses", err);
                                }
                                finally {
                                    if (dongleUhkDevice) {
                                        dongleUhkDevice.close();
                                    }
                                }
                            }

                            this._checkStatusBuffer = true;
                        } else {
                            deviceProtocolVersion = undefined;
                            state.hardwareModules = {
                                moduleInfos: [],
                                rightModuleInfo: {
                                    modules: {}
                                }
                            };
                        }
                        this.win.webContents.send(IpcEvents.device.deviceConnectionStateChanged, state);

                        this.savedState = newState;

                        this.logService.misc('[DeviceService] Device connection state changed to:', JSON.stringify(state, null, 2));
                    }

                    if (state.isMacroStatusDirty) {
                        this._checkStatusBuffer = true;
                    }

                    await this.pollDebugInfo(iterationCount);
                    await this.checkStatusBuffer(deviceProtocolVersion);
                } catch (err) {
                    this.logService.error('[DeviceService] Device connection state query error', err);
                }
            }

            this._uhkDevicePolling = false;
            await snooze(250);
        }
    }

    private async pollDebugInfo(iterationCount: number): Promise<void> {
        if(!this.isI2cDebuggingEnabled) {
            return;
        }

        // the connection state pool runs in every 250ms,
        // but we query the i2c state in every sec so every 4th iteration
        if (iterationCount % 4 !== 0) {
            return;
        }

        const debugInfo = await this.operations.getDebugInfo();

        if (this.i2cWatchdogRecoveryCounter !== debugInfo.i2cWatchdogRecoveryCounter) {
            this.logService.misc(`[DeviceService] I2C watchdog counter changed from ${this.i2cWatchdogRecoveryCounter} => ${debugInfo.i2cWatchdogRecoveryCounter}`);
            this.i2cWatchdogRecoveryCounter = debugInfo.i2cWatchdogRecoveryCounter;
            this.win.webContents.send(IpcEvents.device.i2cWatchdogCounterChanged, this.i2cWatchdogRecoveryCounter);
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
            this._checkStatusBuffer = true;

            if (data.saveInHistory) {
                await saveUserConfigHistoryAsync(buffer, data.deviceId, data.uniqueId);
                await this.loadUserConfigFromHistory(event);
            }

            response.success = true;
        } catch (error) {
            this.logService.error('[DeviceService] Transferring error', error);
            response.error = { message: error.message };
        } finally {
            this.wasCalledSaveUserConfiguration = true;
            this.device.close();
            this.startPollUhkDevice();
        }

        event.sender.send(IpcEvents.device.saveUserConfigurationReply, response);

        return Promise.resolve();
    }

    private async getUserConfigFromHistory(event: Electron.IpcMainEvent, [filename]): Promise<void> {
        const response: UploadFileData = {
            filename,
            data: await getUserConfigFromHistoryAsync(filename),
            saveInHistory: false
        };

        event.sender.send(IpcEvents.device.getUserConfigFromHistoryReply, response);
    }

    private async toggleI2cDebugging(_: Electron.IpcMainEvent, [enabled]): Promise<void> {
        this.logService.error('[DeviceService] Toggle I2C debugging =>', enabled);

        this.isI2cDebuggingEnabled = enabled;
    }

    private async loadUserConfigFromHistory(event: Electron.IpcMainEvent): Promise<void> {
        const files = await loadUserConfigHistoryAsync();

        event.sender.send(IpcEvents.device.loadUserConfigHistoryReply, files);
    }

    private async forceReenumerateDongle(): Promise<void> {
        this.logService.misc('[DeviceService] Dongle force reenumerate');

        let uhkHidDevice: UhkHidDevice;
        try {
            await snooze(1000);
            const uhkDeviceProduct = await getCurrentUhkDongleHID();
            uhkHidDevice = new UhkHidDevice(this.logService, this.options, this.rootDir, uhkDeviceProduct);
            await uhkHidDevice.reenumerate({
                device: UHK_DONGLE,
                enumerationMode: EnumerationModes.NormalKeyboard,
                force: true,
            });
            this.logService.misc('[DeviceService] Dongle force reenumerate done');
        }
        catch(reenumerationError) {
            this.logService.error("[DeviceService] Can't force reenumerate dongle", reenumerationError);
        }
        finally {
            if (uhkHidDevice) {
                uhkHidDevice.close();
            }
            await snooze(1000);
        }
    }

    private async forceReenumerateLeftHalf(): Promise<void> {
        this.logService.misc('[DeviceService] Left half force reenumerate');

        let uhkHidDevice: UhkHidDevice;
        try {
            await snooze(1000);
            const uhkDeviceProduct = await getCurrenUhk80LeftHID();
            uhkHidDevice = new UhkHidDevice(this.logService, this.options, this.rootDir, uhkDeviceProduct);
            await uhkHidDevice.reenumerate({
                device: UHK_80_DEVICE_LEFT,
                enumerationMode: EnumerationModes.NormalKeyboard,
                force: true,
            });
            this.logService.misc('[DeviceService] Left half force reenumerate done');
        }
        catch(reenumerationError) {
            this.logService.error("[DeviceService] Can't force reenumerate left half", reenumerationError);
        }
        finally {
            if (uhkHidDevice) {
                uhkHidDevice.close();
            }
            await snooze(1000);
        }
    }

    private async forceReenumerateDevice(): Promise<void> {
        this.logService.misc('[DeviceService] Device force reenumerate');

        try {
            this.device.close();
            await snooze(1000);
            const uhkDeviceProduct = await getCurrentUhkDeviceProduct(this.options);
            await this.device.reenumerate({
                device: uhkDeviceProduct,
                enumerationMode: EnumerationModes.NormalKeyboard,
                force: true,
            });
            this.logService.misc('[DeviceService] Device force reenumerate done');
        }
        catch(reenumerationError) {
            this.logService.error("[DeviceService] Can't reenumerate force reenumerate device", reenumerationError);
        }
        finally {
            this.device.close();
            await snooze(1000);
        }
    }
}

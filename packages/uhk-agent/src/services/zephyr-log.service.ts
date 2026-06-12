import { ipcMain } from 'electron';
import { setTimeout as setTimeoutPromise } from 'node:timers/promises';
import pLimit from 'p-limit';
import {
    CommandLineArgs,
    escapeZephyrControlChars,
    IpcEvents,
    LogService,
    SHELL_COMMAND_TOO_LONG_ERROR,
    UhkDeviceProduct,
    ZephyrLogEntry,
} from 'uhk-common'
import { UsbVariables } from 'uhk-usb';
import { getCurrentUhkDongleHID, getCurrenUhk80LeftHID, UhkHidDevice, UhkOperations, } from 'uhk-usb'

import { QueueManager } from './queue-manager';

export interface ZephyrLogServiceOptions {
    cliArgs: CommandLineArgs;
    currentDeviceFn: typeof getCurrenUhk80LeftHID | typeof getCurrentUhkDongleHID;
    logService: LogService;
    ipcEvents: {
        execShellCommand: string;
        isZephyrLoggingEnabled: string;
        isZephyrLoggingEnabledReply: string;
        toggleZephyrLogging: string;
    }
    rootDir: string;
    uhkDeviceProduct: UhkDeviceProduct;
    win: Electron.BrowserWindow;
}

export class ZephyrLogService {
    private isEnabled = false;
    private isPaused = false;
    private isPolling = false;
    private isShellEnabled = false;
    private queueManager = new QueueManager();
    private uhkHidDevice: UhkHidDevice;
    private operations: UhkOperations;
    private operationLimiter = pLimit(1);
    private pollerAbortController: AbortController;
    private resumeLoggingTimer: NodeJS.Timeout;

    constructor(private options: ZephyrLogServiceOptions) {
        ipcMain.on(options.ipcEvents.execShellCommand, (...args) => {
            this.queueManager.add({
                method: this.execShellCommand,
                bind: this,
                params: args,
                asynchronous: true
            });
        });

        ipcMain.on(options.ipcEvents.isZephyrLoggingEnabled, (...args) => {
            this.queueManager.add({
                method: this.isZephyrLoggingEnabled,
                bind: this,
                params: args,
                asynchronous: true
            });
        });

        ipcMain.on(options.ipcEvents.toggleZephyrLogging, (...args) => {
            this.queueManager.add({
                method: this.toggleZephyrLogging,
                bind: this,
                params: args,
                asynchronous: true
            });
        });

        this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] Inited`);
    }

    async close(): Promise<void> {
        this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] Closing`);
        await this.waitUntilPollerStopped()
        await this.releaseOperations()
        this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] Closed`);
    }

    async enable(): Promise<void> {
        if (this.isEnabled) {
            return;
        }

        this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] Enabling`);
        this.isEnabled = true;
        this.startLogPoller();
    }

    async disable(): Promise<void> {
        if (!this.isEnabled) {
            return;
        }

        this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] Disabling`);
        this.isEnabled = false;
        await this.waitUntilPollerStopped()
        await this.releaseOperations()
        this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] Disabled`);
    }

    private async execShellCommand(_: Electron.IpcMainEvent, [command]): Promise<void> {
        this.options.logService.misc(`[ZephyrLogService | execute shell command (escaped): ${escapeZephyrControlChars(command)}`);

        try {
            await this.pauseLogging();

            const operations = await this.getOperations();
            if (!operations) {
                const logEntry: ZephyrLogEntry = {
                    log: "Device is not connected. Can't execute shell command",
                    level: 'error',
                    device: this.options.uhkDeviceProduct.logName,
                }
                this.options.win.webContents.send(IpcEvents.device.zephyrLog, logEntry)
                return;
            }
            await operations.execShellCommand(command);
            this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] execute shell command success`);
            // give some time for the command to complete
            await setTimeoutPromise(5);
            await this.readZephyrLog(operations);
        }
        catch (error) {
            this.options.logService.error(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] execute shell command failed`, error);

            if (error.message === SHELL_COMMAND_TOO_LONG_ERROR) {
                const logEntry: ZephyrLogEntry = {
                    log: "Device is not connected. Can't execute shell command",
                    level: 'error',
                    device: this.options.uhkDeviceProduct.logName,
                }
                this.options.win.webContents.send(IpcEvents.device.zephyrLog, logEntry)
            }
            else {
                await this.releaseOperations();
            }
        }
        finally {
            await this.resumeLogging(250);
        }
    }

    private async getOperations(logEarlierInited = true): Promise<UhkOperations> {
        if (logEarlierInited) {
            this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] getOperations`);
        }

        return this.operationLimiter(async () => {
            if (this.operations) {
                if (logEarlierInited) {
                    this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] getOperations returns with earlier inited`);
                }
                return this.operations;
            }

            this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] getOperations init new instances`);
            const hidDevice = await this.options.currentDeviceFn();
            if (!hidDevice) {
                this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] getOperations device not connected`);
                return;
            }

            this.uhkHidDevice = new UhkHidDevice(this.options.logService, this.options.cliArgs, this.options.rootDir, hidDevice);
            this.operations = new UhkOperations(this.options.logService, this.uhkHidDevice);
            this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] getOperations new instances are inited`);

            return this.operations;
        })
    }

    private async releaseOperations(): Promise<void> {
        this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] releaseOperations`);

        return this.operationLimiter(async () => {
            if (!this.operations) {
                this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] no instances to release`);

                return;
            }

            this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] releasing instances`);
            try {
                await this.uhkHidDevice.close()
            }
            catch (error) {
                this.options.logService.error(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] failed to close HID device. Ignoring error.`, error);
            }
            this.uhkHidDevice = undefined;
            this.operations = undefined
            this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] instances are released`);
        })
    }

    private async isZephyrLoggingEnabled(event: Electron.IpcMainEvent): Promise<void> {
        try {
            await this.pauseLogging();
            this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] Check zephyr logging enabled`);
            const operations = await this.getOperations();
            if (!operations) {
                return;
            }
            const response = await operations.getVariable(UsbVariables.ShellEnabled)
            const enabled = response === 1
            this.isShellEnabled = enabled
            this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] Is zephyr logging enabled: ${enabled}`);
            event.sender.send(this.options.ipcEvents.isZephyrLoggingEnabledReply, enabled);
        }
        catch (error) {
            this.options.logService.error(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] check zephyr logging enabled failed`, error);
            await this.releaseOperations();
        }
        finally {
            await this.resumeLogging();
        }
    }

    /**
     * Pause the polling while other operation runs
     * @private
     */
    private async pauseLogging(): Promise<void> {
        this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] pausing logging`);
        this.isPaused = true;
        this.pollerAbortController?.abort();
        await this.waitUntilPollerStopped()
        this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] paused logging`);
    }

    private async readZephyrLog(operations: UhkOperations): Promise<void> {
        try {
            const log = (await operations.getVariable(UsbVariables.ShellBuffer)) as string;
            this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] Zephyr log (escaped): ${escapeZephyrControlChars(log)}`);
            const logEntry: ZephyrLogEntry = {
                log: log as string,
                level: 'info',
                device: this.options.uhkDeviceProduct.logName,
            }
            this.options.win.webContents.send(IpcEvents.device.zephyrLog, logEntry)
        }
        catch (error) {
            this.options.logService.error(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] can't read zephyr log`, error);
            const logEntry: ZephyrLogEntry = {
                log: error.message as string,
                level: 'error',
                device: this.options.uhkDeviceProduct.logName,
            }
            this.options.win.webContents.send(IpcEvents.device.zephyrLog, logEntry)
            await this.releaseOperations();
        }
    }

    private async resumeLogging(delay = 0): Promise<void> {
        if (!this.isPaused) {
            return;
        }

        if (this.resumeLoggingTimer) {
            clearTimeout(this.resumeLoggingTimer);
            this.resumeLoggingTimer = undefined;
        }

        if (delay === 0) {
            this.resumeLoggingFunction();
            return;
        }

        this.resumeLoggingTimer = setTimeout(() => {
            this.resumeLoggingFunction();
        }, delay);
    }

    private resumeLoggingFunction() {
        this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] resuming logging`);
        this.isPaused = false;
        this.startLogPoller();
    }

    private async startLogPoller(): Promise<void> {
        if (this.isPolling) {
            return;
        }

        try {
            this.isPolling = true;

            while (this.isEnabled && this.isShellEnabled && !this.isPaused) {
                try {
                    const operations = await this.getOperations(false);
                    if (!operations) {
                        await setTimeoutPromise(250)
                        continue;
                    }

                    const deviceState = await this.uhkHidDevice.getDeviceState();

                    if (deviceState.isZephyrLogAvailable) {
                        await this.readZephyrLog(operations);
                    }
                } catch (error) {
                    this.options.logService.error(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] Can't poll log`, error);
                    const logEntry: ZephyrLogEntry = {
                        log: error.message,
                        level: 'error',
                        device: this.options.uhkDeviceProduct.logName,
                    }
                    this.options.win.webContents.send(IpcEvents.device.zephyrLog, logEntry)
                    await this.releaseOperations()
                }

                if (!this.pollerAbortController) {
                    this.pollerAbortController = new AbortController();
                }

                try {
                    await setTimeoutPromise(250, () => {}, { signal: this.pollerAbortController.signal })
                }
                catch {
                    // dont care about abort
                }
            }
        }
        finally {
            this.isPolling = false;
            this.pollerAbortController = undefined;
        }
    }

    private async waitUntilPollerStopped(): Promise<void> {
        this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] wait until polling`);
        while (this.isPolling) {
            await setTimeoutPromise(100)
        }
        this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] stopped`);
    }

    private async toggleZephyrLogging(_: Electron.IpcMainEvent, [enabled]): Promise<void> {
        this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] Toggle zephyr logging => ${enabled}`);

        try {
            await this.pauseLogging();
            const operations = await this.getOperations();
            if (!operations) {
                const logEntry: ZephyrLogEntry = {
                    log: "Device is not connected. Can't toggle zephyr logging",
                    level: 'error',
                    device: this.options.uhkDeviceProduct.logName,
                }
                this.options.win.webContents.send(IpcEvents.device.zephyrLog, logEntry)
                return;
            }
            await operations.setVariable(UsbVariables.ShellEnabled, enabled);
            this.isShellEnabled = enabled;
            this.options.logService.misc(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] Set zephyr logging => ${enabled}`);
        }
        catch (error) {
            this.options.logService.error(`[ZephyrLogService | ${this.options.uhkDeviceProduct.logName}] toggle zephyr logging failed`, error);
            await this.releaseOperations();
        }
        finally {
            await this.resumeLogging();
        }
    }
}

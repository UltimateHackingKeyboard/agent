import { ipcMain, shell } from 'electron';
import settings from 'electron-settings';
import * as os from 'os';

import { AppStartInfo, CommandLineArgs, IpcEvents, LogService } from 'uhk-common';
import { getFirmwarePackageJson } from 'uhk-usb';

import { MainServiceBase } from './main-service-base';
import { DeviceService } from './device.service';
import { getDefaultFirmwarePath, getUdevFileContentAsync } from '../util';

export class AppService extends MainServiceBase {
    constructor(protected logService: LogService,
                protected win: Electron.BrowserWindow,
                private deviceService: DeviceService,
                private options: CommandLineArgs,
                private rootDir: string) {
        super(logService, win);

        ipcMain.on(IpcEvents.app.getAppStartInfo, this.handleAppStartInfo.bind(this));
        ipcMain.on(IpcEvents.app.exit, this.exit.bind(this));
        ipcMain.on(IpcEvents.app.openUrl, this.openUrl.bind(this));
        ipcMain.handle(IpcEvents.app.getConfig, async (event, key) => {
            logService.misc(`[AppService] get-config: ${key}`);

            const config = await settings.get(key);
            logService.misc(`[AppService] get-config of "${key}": ${config}`);

            return config;
        });
        ipcMain.handle(IpcEvents.app.setConfig, async (event, key, value) => {
            logService.misc(`[AppService] set-config of "${key}": ${value}`);
            await settings.set(key, value);
        });
        logService.misc('[AppService] init success');
    }

    private async handleAppStartInfo(event: Electron.IpcMainEvent) {
        try {
            this.logService.misc('[AppService] getAppStartInfo');

            const response: AppStartInfo = {
                bundledFirmwareJson: await getFirmwarePackageJson(getDefaultFirmwarePath(this.rootDir)),
                commandLineArgs: {
                    modules: this.options.modules || false,
                    'disable-agent-update-protection': this.options['disable-agent-update-protection'] || false,
                    log: this.options.log
                },
                platform: process.platform as string,
                osVersion: os.release(),
                udevFileContent: await getUdevFileContentAsync(this.rootDir)
            };
            this.logService.misc('[AppService] getAppStartInfo response:', response);
            return event.sender.send(IpcEvents.app.getAppStartInfoReply, response);
        } catch (error) {
            this.logService.misc('[AppService] getAppStartInfo failed:', error);
        }
    }

    private exit() {
        this.logService.misc('[AppService] exit');
        this.win.close();
    }

    private openUrl(event: Electron.Event, urls: Array<string>) {
        shell.openExternal(urls[0]);
    }
}

import { app, ipcMain, shell } from 'electron';
import settings from 'electron-settings';
import * as os from 'os';

import { AppStartInfo, CommandLineArgs, IpcEvents, LogService } from 'uhk-common';
import { MainServiceBase } from './main-service-base';
import { DeviceService } from './device.service';
import { getUdevFileContentAsync, isRunningOnWayland } from '../util';

export class AppService extends MainServiceBase {
    constructor(protected logService: LogService,
                protected win: Electron.BrowserWindow,
                private deviceService: DeviceService,
                private options: CommandLineArgs,
                private rootDir: string) {
        super(logService, win);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        ipcMain.on(IpcEvents.app.getAppStartInfo, this.handleAppStartInfo.bind(this));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        ipcMain.on(IpcEvents.app.exit, this.exit.bind(this));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        ipcMain.on(IpcEvents.app.openConfigFolder, this.openConfigFolder.bind(this));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        ipcMain.on(IpcEvents.app.openUrl, this.openUrl.bind(this));
        ipcMain.handle(IpcEvents.app.getConfig, async (event, key: string) => {
            logService.misc(`[AppService] get-config: ${key}`);

            const config = await settings.get(key);
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            logService.misc(`[AppService] get-config of "${key}": ${config}`);

            return config;
        });
        ipcMain.handle(IpcEvents.app.setConfig, async (event, key: string, value: never) => {
            logService.misc(`[AppService] set-config of "${key}": ${value}`);
            await settings.set(key, value);
        });
        logService.misc('[AppService] init success');
    }

    private async handleAppStartInfo(event: Electron.IpcMainEvent) {
        try {
            this.logService.misc('[AppService] getAppStartInfo');

            const response: AppStartInfo = {
                commandLineArgs: {
                    'disable-agent-update-protection': this.options['disable-agent-update-protection'] || false,
                    log: this.options.log
                },
                isRunningOnWayland: isRunningOnWayland(),
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

    private openConfigFolder() {
        shell.showItemInFolder(app.getPath('userData'));
    }

    private openUrl(event: Electron.Event, urls: Array<string>) {
        shell.openExternal(urls[0]);
    }
}

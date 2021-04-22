import { ipcMain, shell } from 'electron';
import { UhkHidDevice } from 'uhk-usb';
import * as os from 'os';

import { AppStartInfo, CommandLineArgs, IpcEvents, LogService } from 'uhk-common';
import { MainServiceBase } from './main-service-base';
import { DeviceService } from './device.service';
import { getUdevFileContentAsync } from '../util';

export class AppService extends MainServiceBase {
    constructor(protected logService: LogService,
                protected win: Electron.BrowserWindow,
                private deviceService: DeviceService,
                private options: CommandLineArgs,
                private uhkHidDeviceService: UhkHidDevice,
                private rootDir: string) {
        super(logService, win);

        ipcMain.on(IpcEvents.app.getAppStartInfo, this.handleAppStartInfo.bind(this));
        ipcMain.on(IpcEvents.app.exit, this.exit.bind(this));
        ipcMain.on(IpcEvents.app.openUrl, this.openUrl.bind(this));
        logService.misc('[AppService] init success');
    }

    private async handleAppStartInfo(event: Electron.IpcMainEvent) {
        this.logService.misc('[AppService] getAppStartInfo');
        const deviceConnectionState = await this.uhkHidDeviceService.getDeviceConnectionStateAsync();
        if (deviceConnectionState.hasPermission && deviceConnectionState.connectedDevice) {
            deviceConnectionState.hardwareModules = await this.deviceService.getHardwareModules(false);
        } else {
            deviceConnectionState.hardwareModules = {
                moduleInfos: [],
                rightModuleInfo: {}
            };
        }

        const response: AppStartInfo = {
            deviceConnectionState,
            commandLineArgs: {
                modules: this.options.modules || false,
                log: this.options.log
            },
            platform: process.platform as string,
            osVersion: os.release(),
            udevFileContent: await getUdevFileContentAsync(this.rootDir)
        };
        this.logService.misc('[AppService] getAppStartInfo response:', response);
        return event.sender.send(IpcEvents.app.getAppStartInfoReply, response);
    }

    private exit() {
        this.logService.misc('[AppService] exit');
        this.win.close();
    }

    private openUrl(event: Electron.Event, urls: Array<string>) {
        shell.openExternal(urls[0]);
    }
}
